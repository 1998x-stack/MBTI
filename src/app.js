import { questions, QUESTION_BANK_VERSION } from "./data/questions.js";
import { profiles } from "./data/profiles.js";
import { explainAssessment } from "./core/explanation.js";
import { setResultArtwork, handleArtworkFailure } from "./ui/image-loader.js";
import { migrateProgress } from "./core/migration.js";
import { imageManifest } from "./data/image-manifest.js";
import { AXES, evaluateAnswers, validateQuestionBank } from "./core/assessment.js";

const STORAGE_KEY = "personaquest:progress:" + QUESTION_BANK_VERSION;
const THEME_KEY = "personaquest:theme";
const screens = Object.fromEntries(["home", "quiz", "results", "types"].map((name) =>
  [name, document.getElementById("screen-" + name)]));
const $ = (id) => document.getElementById(id);
const axisIcons = { EI: "↔", SN: "◈", TF: "✧", JP: "⌁" };
const state = {
  screen: "home",
  index: 0,
  answers: Object.create(null),
  finished: false,
};
let toastTimeout = null;

validateQuestionBank(questions);

function restoreProgress() {
  try {
    const payload = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!payload) return;
    const restored = migrateProgress(questions, payload, payload.version, QUESTION_BANK_VERSION);
    if (!["compatible", "partial"].includes(restored.status)) return;
    state.answers = Object.assign(Object.create(null), restored.answers);
    state.index = restored.index;
    state.finished = restored.finished && evaluateAnswers(questions, state.answers).completed;
  } catch {
    // Storage can be blocked or contain damaged data. The quiz must remain usable.
  }
}

function persistProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: QUESTION_BANK_VERSION,
      index: state.index,
      answers: state.answers,
      finished: state.finished,
    }));
  } catch {
    // Private browsing and restricted storage must not block question answering.
  }
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toast.hidden = true; }, 4000);
}

function setScreen(name, focus = true) {
  if (!Object.hasOwn(screens, name)) return;
  if (name === "results" && (!state.finished || !evaluateAnswers(questions, state.answers).completed)) {
    return setScreen("home", focus);
  }
  state.screen = name;
  for (const [key, screen] of Object.entries(screens)) screen.hidden = key !== name;
  document.querySelectorAll("[data-route]").forEach((button) => {
    const selected = button.dataset.route === name;
    button.classList.toggle("is-active", selected && button.classList.contains("nav-link"));
    if (button.classList.contains("nav-link")) {
      if (selected) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    }
  });
  if (name === "quiz") renderQuiz();
  if (name === "results") renderResults();
  if (name === "types") renderLibrary();
  updateResumeButton();
  window.scrollTo({ top: 0, behavior: "instant" });
  if (focus) {
    const target = { home: "home-heading", quiz: "quiz-heading", results: "results-heading", types: "types-heading" }[name];
    $(target).focus({ preventScroll: true });
  }
}

function newJourney() {
  state.index = 0;
  state.answers = Object.create(null);
  state.finished = false;
  persistProgress();
  setScreen("quiz");
}

function updateResumeButton() {
  const result = evaluateAnswers(questions, state.answers);
  const button = $("resume-button");
  button.hidden = result.answered === 0;
  if (!button.hidden) {
    button.firstChild.textContent = state.finished ? "查看上次的结果 " : "继续上次的探索 ";
    $("resume-count").textContent = state.finished ? "" : result.answered + " / " + result.total;
  }
}

function renderAxisTracker() {
  const tracker = $("axis-tracker");
  tracker.replaceChildren();
  const progress = evaluateAnswers(questions, state.answers);
  for (const axis of AXES) {
    const axisResult = progress.axes.find((item) => item.id === axis.id);
    const row = document.createElement("div");
    row.className = "axis-tracker-row";
    row.classList.toggle("is-current", questions[state.index].axis === axis.id);
    const symbol = document.createElement("span");
    symbol.className = "axis-track-icon";
    symbol.textContent = axisIcons[axis.id];
    symbol.setAttribute("aria-hidden", "true");
    const name = document.createElement("span");
    name.className = "axis-track-text";
    name.textContent = axis.name;
    const count = document.createElement("span");
    count.className = "axis-track-count";
    count.textContent = axisResult.answeredQuestions + " / " + axisResult.questionCount;
    row.append(symbol, name, count);
    tracker.appendChild(row);
  }
}

function updateOptionSelection() {
  const q = questions[state.index];
  for (const input of $("quiz-options").querySelectorAll("input[type=radio]")) {
    const selected = state.answers[q.id] === input.value;
    input.checked = selected;
    input.closest(".option-card").querySelector(".option-check").textContent = selected ? "✓" : "";
  }
  $("next-question").disabled = !state.answers[q.id];
  $("quiz-hint").textContent = state.answers[q.id]
    ? "已记录选择。可直接修改，或继续下一题。" : "选择最贴近你的那一项，没有标准答案。";
}

function chooseOption(id) {
  if (state.screen !== "quiz") return;
  const q = questions[state.index];
  if (!q.options.some((option) => option.id === id)) return;
  state.answers[q.id] = id;
  state.finished = false;
  updateOptionSelection();
  renderAxisTracker();
  const answered=evaluateAnswers(questions,state.answers).answered;
  $("quiz-progress").setAttribute("aria-valuenow",String(answered));
  $("quiz-progress").setAttribute("aria-valuetext","已完成 "+answered+" / "+questions.length+" 题");
  $("quiz-progress-fill").style.width=(answered/questions.length*100)+"%";
  persistProgress();
}

function renderQuiz() {
  const q = questions[state.index];
  $("question-counter").textContent = String(state.index + 1).padStart(2, "0") + " / " + questions.length;
  $("quiz-axis-label").textContent = AXES.find((axis) => axis.id === q.axis).name;
  $("quiz-heading").textContent = q.title;
  $("quiz-scenario").textContent = q.scenario;
  $("quiz-prompt").textContent = q.prompt;
  $("quiz-progress").setAttribute("aria-valuemax", String(questions.length));
  const answered=evaluateAnswers(questions,state.answers).answered;
  $("quiz-progress").setAttribute("aria-valuenow",String(answered));
  $("quiz-progress").setAttribute("aria-valuetext","已完成 "+answered+" / "+questions.length+" 题");
  $("quiz-progress-fill").style.width=(answered/questions.length*100)+"%";
  const optionList=$("quiz-options");
  optionList.replaceChildren();
  const legend=document.createElement("legend");
  legend.className="sr-only";
  legend.textContent="选择最接近自己的选项";
  optionList.appendChild(legend);
  q.options.forEach((option,i)=>{
    const label=document.createElement("label");
    label.className="option-card";
    const radio=document.createElement("input");
    radio.type="radio";radio.name="quiz-answer";radio.value=option.id;
    radio.setAttribute("aria-describedby","quiz-hint");
    const index=document.createElement("span");
    index.className="option-index";index.textContent=String(i+1);index.setAttribute("aria-hidden","true");
    const title=document.createElement("span");
    title.className="option-label";title.textContent=option.label;
    const check=document.createElement("span");
    check.className="option-check";check.setAttribute("aria-hidden","true");
    label.append(radio,index,title,check);
    radio.addEventListener("change",()=>chooseOption(option.id));
    optionList.append(label);
  });
  $("previous-question").disabled = state.index === 0;
  $("next-question").lastChild.textContent = state.index === questions.length - 1 ? " ↗" : " →";
  $("next-question").firstChild.textContent = state.index === questions.length - 1 ? "查看我的结果 " : "下一题 ";
  updateOptionSelection();
  renderAxisTracker();
}

function goBack() {
  if (state.screen !== "quiz" || state.index === 0) return;
  state.index -= 1;
  persistProgress();
  renderQuiz();
  $("quiz-heading").focus({ preventScroll: true });
}

function goForward() {
  if (state.screen !== "quiz") return;
  const q = questions[state.index];
  if (!q.options.some((option) => option.id === state.answers[q.id])) return;
  if (state.index < questions.length - 1) {
    state.index += 1;
    persistProgress();
    renderQuiz();
    $("quiz-heading").focus({ preventScroll: true });
    return;
  }
  const result = evaluateAnswers(questions, state.answers);
  if (!result.completed) {
    const firstUnanswered = questions.findIndex((item) => !state.answers[item.id]);
    state.index = Math.max(0, firstUnanswered);
    renderQuiz();
    showToast("还有题目尚未完成，请先作答。");
    return;
  }
  state.finished = true;
  persistProgress();
  setScreen("results");
}

function appendText(parent, tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.textContent = text;
  parent.appendChild(node);
  return node;
}

function renderResults() {
  const result = evaluateAnswers(questions, state.answers);
  if (!result.completed) return;
  const explanation=explainAssessment(questions,state.answers,result);
  const profile=result.type?profiles[result.type]:null;
  $("result-code").textContent=result.type||"MIXED";
  $("result-title").textContent=profile?profile.title:"多面探索者";
  $("result-description").textContent=explanation.summary;
  const image=$("result-animal");
  setResultArtwork(image,profile,result.type?imageManifest[result.type]:null);
  const panel=$("result-axes");
  panel.replaceChildren();
  for(const axis of explanation.axes){
    const row=document.createElement("section");
    row.className="score-axis";
    const heading=document.createElement("div");
    heading.className="score-axis-heading";
    appendText(heading,"span","",axis.name+" · "+axis.id);
    appendText(heading,"span","axis-note",axis.preference?"本次偏向 "+axis.preference:"本次加权持平");
    const selected=document.createElement("div");
    selected.className="score-axis-labels";
    appendText(selected,"span","",axis.left+" 选择 "+axis.leftChoices+" 道");
    appendText(selected,"span","",axis.right+" 选择 "+axis.rightChoices+" 道");
    const bar=document.createElement("div");
    bar.className="score-axis-track";
    bar.setAttribute("role","img");
    bar.setAttribute("aria-label",axis.name+"："+axis.left+"选择"+axis.leftChoices+"道；"+axis.right+"选择"+axis.rightChoices+"道");
    const fill=document.createElement("div");
    fill.className="score-axis-fill";
    fill.style.width=(axis.leftChoices/axis.evidence.length*100)+"%";
    bar.append(fill,document.createElement("span"));
    const interpretation=appendText(row,"p","axis-explanation",axis.narrative);
    const details=document.createElement("details");
    details.className="evidence-details";
    appendText(details,"summary","","查看这组维度的 "+axis.evidence.length+" 条作答依据");
    const evidenceList=document.createElement("ol");
    for(const evidence of axis.evidence){
      const li=document.createElement("li");
      appendText(li,"strong","",evidence.title);
      appendText(li,"span","","所选："+evidence.selected);
      evidenceList.append(li);
    }
    details.append(evidenceList);
    row.prepend(heading,selected,bar);
    row.append(details);
    panel.append(row);
  }
  const limitations=$("result-limitations");
  if(limitations){
    limitations.replaceChildren();
    for(const item of explanation.limitations)appendText(limitations,"li","",item);
  }
}

function renderLibrary() {
  const grid = $("types-grid");
  if (grid.childElementCount > 0) return;
  for (const profile of Object.values(profiles)) {
    const card = document.createElement("article");
    card.className = "type-card";
    const top = document.createElement("div");
    top.className = "type-card-top";
    appendText(top, "span", "type-emoji", profile.emoji).setAttribute("aria-hidden", "true");
    appendText(top, "span", "type-code", profile.type);
    card.appendChild(top);
    appendText(card, "h2", "", profile.title);
    appendText(card, "span", "type-card-subtitle", profile.animal + " · " + profile.traits.slice(0,2).join(" / "));
    appendText(card, "p", "", profile.description);
    grid.appendChild(card);
  }
}

async function shareResult() {
  const result = evaluateAnswers(questions, state.answers);
  if (!result.completed) return;
  const profile = result.type ? profiles[result.type] : null;
  const message = result.type ?
    "我在 PersonaQuest 的趣味探索画像是 " + result.type + " · " + profile.title + "。仅供娱乐和自我探索。" :
    "我刚在 PersonaQuest 完成了一次趣味人格探索，发现了自己多面而灵活的偏好。";
  if (navigator.share) {
    try {
      await navigator.share({ title: "PersonaQuest · 我的探索画像", text: message, url: location.origin + location.pathname });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(message + " " + location.origin + location.pathname);
      showToast("结果文案已复制。分享内容不包含你的逐题答案。");
      return;
    } catch {
      // A blocked Clipboard API should produce a clear UI fallback.
    }
  }
  showToast("无法自动分享。你可以手动记录类型代号：" + (result.type || "MIXED"));
}

function clearData() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* browser blocks storage */ }
  state.answers = Object.create(null);
  state.index = 0;
  state.finished = false;
  setScreen("home");
  showToast("本地答题记录已清除。");
}

function changeTheme() {
  const dark = document.documentElement.dataset.theme !== "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  $("theme-icon").textContent = dark ? "☀" : "☾";
  $("theme-toggle").setAttribute("aria-label", dark ? "切换浅色模式" : "切换深色模式");
  try { localStorage.setItem(THEME_KEY, dark ? "dark" : "light"); } catch { /* optional */ }
}

function restoreTheme() {
  let choice = "";
  try { choice = localStorage.getItem(THEME_KEY) || ""; } catch { /* optional */ }
  if (!["dark", "light"].includes(choice)) {
    choice = window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.dataset.theme = choice;
  $("theme-icon").textContent = choice === "dark" ? "☀" : "☾";
  $("theme-toggle").setAttribute("aria-label", choice === "dark" ? "切换浅色模式" : "切换深色模式");
}

function init() {
  restoreTheme();
  restoreProgress();
  for (const button of document.querySelectorAll("[data-route]")) {
    button.addEventListener("click", () => setScreen(button.dataset.route));
  }
  for (const id of ["start-button", "start-again-button", "library-start", "restart-button"]) {
    $(id).addEventListener("click", newJourney);
  }
  $("resume-button").addEventListener("click", () => setScreen(state.finished ? "results" : "quiz"));
  $("previous-question").addEventListener("click", goBack);
  $("next-question").addEventListener("click", goForward);
  $("theme-toggle").addEventListener("click", changeTheme);
  $("share-button").addEventListener("click", shareResult);
  $("clear-data").addEventListener("click", clearData);
  $("result-animal").addEventListener("error", () => {
    // <picture> sources take priority over <img src>; changing only src cannot recover.
    handleArtworkFailure($("result-animal"));
  });
  document.addEventListener("keydown", (event) => {
    if (state.screen !== "quiz" || event.altKey || event.ctrlKey || event.metaKey ||
      event.isComposing || event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement ||
      event.target?.isContentEditable) return;
    if (/^[1-4]$/.test(event.key)) {
      const option = questions[state.index].options[Number(event.key) - 1];
      if (option) {
        chooseOption(option.id);
        $("quiz-options").querySelectorAll("input[type=radio]")[Number(event.key)-1]?.focus();
      }
    }
  });
  setScreen("home", false);
}
init();
