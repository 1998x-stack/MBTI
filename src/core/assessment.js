/**
 * Pure assessment domain: no DOM, timers, network, or persistence.
 * Scores describe relative answers to this short, non-diagnostic questionnaire.
 */
export const AXES = Object.freeze([
  { id: "EI", left: "E", right: "I", name: "能量来源", leftName: "外向互动", rightName: "独处思考" },
  { id: "SN", left: "S", right: "N", name: "信息偏好", leftName: "具体事实", rightName: "抽象可能" },
  { id: "TF", left: "T", right: "F", name: "决策视角", leftName: "逻辑分析", rightName: "情境关照" },
  { id: "JP", left: "J", right: "P", name: "生活节奏", leftName: "计划安排", rightName: "灵活探索" },
]);
const LETTERS = new Set(AXES.flatMap((axis) => [axis.left, axis.right]));

export function validateQuestionBank(bank) {
  if (!Array.isArray(bank) || bank.length === 0) throw new Error("Question bank must be non-empty");
  const ids = new Set();
  const counts = Object.fromEntries(AXES.map((axis) => [axis.id, 0]));
  for (const question of bank) {
    if (!question || typeof question.id !== "string" || ids.has(question.id)) {
      throw new Error("Missing or duplicate question ID");
    }
    ids.add(question.id);
    const axis = AXES.find((item) => item.id === question.axis);
    if (!axis || !question.title || !question.scenario || !question.prompt) {
      throw new Error("Invalid question: " + question.id);
    }
    if (!Array.isArray(question.options) || question.options.length < 2) {
      throw new Error("Question must have at least two options: " + question.id);
    }
    const optionIds = new Set();
    const letters = new Set();
    for (const option of question.options) {
      if (!option || typeof option.id !== "string" || optionIds.has(option.id) ||
          !LETTERS.has(option.letter) || ![axis.left, axis.right].includes(option.letter) ||
          !Number.isInteger(option.weight) || option.weight < 1 || option.weight > 5 ||
          typeof option.label !== "string" || option.label.trim().length === 0) {
        throw new Error("Invalid option in " + question.id);
      }
      optionIds.add(option.id);
      letters.add(option.letter);
    }
    if (!letters.has(axis.left) || !letters.has(axis.right)) {
      throw new Error("Both sides of an axis must be represented: " + question.id);
    }
    counts[axis.id] += 1;
  }
  for (const axis of AXES) {
    if (counts[axis.id] === 0) throw new Error("Missing axis: " + axis.id);
  }
  return Object.freeze({ questionCount: bank.length, axisQuestionCounts: counts });
}

/**
 * The answer map is {questionId: optionId}. Unknown/stale selections are ignored,
 * and scores are recomputed from scratch on every call (no accumulation drift).
 */
export function evaluateAnswers(bank, answers = {}) {
  const schema = validateQuestionBank(bank);
  const provided = answers && typeof answers === "object" && !Array.isArray(answers) ? answers : {};
  const totals = Object.fromEntries([...LETTERS].map((letter) => [letter, 0]));
  const answeredPerAxis = Object.fromEntries(AXES.map((axis) => [axis.id, 0]));
  let answered = 0;
  for (const question of bank) {
    const choice = question.options.find((option) => option.id === provided[question.id]);
    if (!choice) continue;
    totals[choice.letter] += choice.weight;
    answered += 1;
    answeredPerAxis[question.axis] += 1;
  }
  const axes = AXES.map((axis) => {
    const leftScore = totals[axis.left];
    const rightScore = totals[axis.right];
    const sum = leftScore + rightScore;
    const preference = !sum || leftScore === rightScore ? null :
      leftScore > rightScore ? axis.left : axis.right;
    return {
      ...axis, leftScore, rightScore,
      leftPercent: sum ? Math.round((leftScore / sum) * 100) : null,
      rightPercent: sum ? 100 - Math.round((leftScore / sum) * 100) : null,
      preference, answeredQuestions: answeredPerAxis[axis.id],
      questionCount: schema.axisQuestionCounts[axis.id],
      isBalanced: sum > 0 && leftScore === rightScore,
    };
  });
  const completed = answered === bank.length;
  const type = completed && axes.every((axis) => axis.preference) ?
    axes.map((axis) => axis.preference).join("") : null;
  return { answered, total: bank.length, completed, type, axes };
}

export function safeRestoreAnswers(bank, data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return {};
  const restored = Object.create(null);
  for (const question of bank) {
    if (question.options.some((option) => option.id === data[question.id])) {
      restored[question.id] = data[question.id];
    }
  }
  return restored;
}
