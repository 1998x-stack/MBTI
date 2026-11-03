import test from "node:test";
import assert from "node:assert/strict";
import { AXES, validateQuestionBank, evaluateAnswers, safeRestoreAnswers } from "../../src/core/assessment.js";
import { questions, QUESTION_BANK_VERSION } from "../../src/data/questions.js";
import { profiles } from "../../src/data/profiles.js";

test("question bank has unique IDs, complete options, and 3 questions per axis", () => {
  const result = validateQuestionBank(questions);
  assert.equal(result.questionCount, 12);
  assert.deepEqual(result.axisQuestionCounts, { EI: 3, SN: 3, TF: 3, JP: 3 });
  assert.equal(QUESTION_BANK_VERSION, "2.1.0");
});

test("all sixteen outcomes have complete profile metadata", () => {
  assert.equal(Object.keys(profiles).length, 16);
  for (const type of ["E", "I"].flatMap(a => ["S", "N"].flatMap(b => ["T", "F"].flatMap(c => ["J", "P"].map(d => a+b+c+d))))) {
    assert.ok(profiles[type], "Missing " + type);
    assert.ok(profiles[type].image.startsWith("./assets/images/"));
    assert.ok(profiles[type].description);
  }
});

test("empty and malformed answers do not produce a personality type", () => {
  const none = evaluateAnswers(questions, {});
  assert.equal(none.answered, 0);
  assert.equal(none.completed, false);
  assert.equal(none.type, null);
  assert.ok(none.axes.every(a => a.leftPercent === null));
  assert.equal(evaluateAnswers(questions, { q01:"unknown" }).answered, 0);
});

test("first option across all questions yields ESTJ; fourth yields INFP", () => {
  const first = Object.fromEntries(questions.map(q => [q.id,q.options[0].id]));
  const last = Object.fromEntries(questions.map(q => [q.id,q.options[3].id]));
  assert.equal(evaluateAnswers(questions, first).type, "ESTJ");
  assert.equal(evaluateAnswers(questions, last).type, "INFP");
});

test("all sixteen four-letter combinations are reachable", () => {
  for (const e of ["E","I"]) for (const s of ["S","N"]) for (const t of ["T","F"]) for (const j of ["J","P"]) {
    const type = e+s+t+j;
    const target = { EI:e,SN:s,TF:t,JP:j };
    const choices=Object.fromEntries(questions.map(q=>[q.id,q.options.find(x=>x.letter===target[q.axis]).id]));
    assert.equal(evaluateAnswers(questions,choices).type,type);
  }
});

test("recomputation is deterministic and input data is never mutated", () => {
  const answers={q01:"q01-a",q02:"q02-b"};
  const before=JSON.stringify(answers);
  const a=evaluateAnswers(questions,answers);
  const b=evaluateAnswers(questions,answers);
  assert.deepEqual(a,b);
  assert.equal(JSON.stringify(answers),before);
  const edited={...answers,q01:"q01-d"};
  assert.notDeepEqual(evaluateAnswers(questions,edited).axes[0],a.axes[0]);
});

test("ties are not silently coerced into I/N/F/P", () => {
  const tieQuestions=[{id:"x1",axis:"EI",title:"Title",scenario:"Context",prompt:"Prompt",options:[{id:"a",letter:"E",weight:2,label:"A"},{id:"b",letter:"I",weight:2,label:"B"}]},
    ...AXES.slice(1).map(a=>({id:"x"+a.id,axis:a.id,title:"Title",scenario:"Context",prompt:"Prompt",options:[{id:a.left,letter:a.left,weight:1,label:"A"},{id:a.right,letter:a.right,weight:1,label:"B"}]}))];
  const scores=evaluateAnswers(tieQuestions,{x1:"a",xSN:"S",xTF:"T",xJP:"J"});
  assert.equal(scores.type,"ESTJ");
  assert.equal(scores.axes[0].leftPercent,100);
  assert.equal(evaluateAnswers(tieQuestions,{}).type,null);
});

test("stale, unknown, and invalid persisted answers are discarded", () => {
  const data=Object.create(null);
  data.q01="q01-a";data.q02="not-an-option";data.rogue="q03-a";
  const restored=safeRestoreAnswers(questions,data);
  assert.equal(restored.q01,"q01-a");
  assert.equal(Object.hasOwn(restored,"q02"),false);
  assert.equal(Object.hasOwn(restored,"rogue"),false);
});
