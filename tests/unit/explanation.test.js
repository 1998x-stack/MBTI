import test from "node:test";
import assert from "node:assert/strict";
import { questions } from "../../src/data/questions.js";
import { evaluateAnswers } from "../../src/core/assessment.js";
import { explainAssessment,EXPLANATION_VERSION } from "../../src/core/explanation.js";
test("explanation is unavailable for incomplete answers",()=>{
 const e=explainAssessment(questions,{},evaluateAnswers(questions,{}));
 assert.equal(e.completed,false);assert.equal(e.axes.length,0);
});
test("all explanations trace exactly to the original three selected choices",()=>{
 const answers=Object.fromEntries(questions.map(q=>[q.id,q.options[0].id]));
 const e=explainAssessment(questions,answers,evaluateAnswers(questions,answers));
 assert.equal(e.version,EXPLANATION_VERSION);
 assert.equal(e.axes.length,4);
 for(const axis of e.axes){
  assert.equal(axis.evidence.length,3);
  assert.equal(axis.leftChoices+axis.rightChoices,3);
  for(const item of axis.evidence) {
   const q=questions.find(x=>x.id===item.questionId);
   assert.equal(item.selected,q.options.find(o=>o.id===answers[q.id]).label);
  }
 }
 assert.equal(e.type,"ESTJ");
});
test("explanation is deterministic and does not fabricate confidence",()=>{
 const answers=Object.fromEntries(questions.map(q=>[q.id,q.options[3].id]));
 const input=evaluateAnswers(questions,answers);
 const a=explainAssessment(questions,answers,input);
 assert.deepEqual(a,explainAssessment(questions,answers,input));
 assert.equal(a.type,"INFP");
 assert.equal(JSON.stringify(a).includes("confidence"),false);
});
