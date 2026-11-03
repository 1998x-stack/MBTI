import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateBank,validateProfiles } from "../../scripts/validate-data.mjs";
import { migrateProgress } from "../../src/core/migration.js";
import { questions } from "../../src/data/questions.js";
import { profiles } from "../../src/data/profiles.js";
const read=(file)=>JSON.parse(readFileSync(new URL("../../"+file,import.meta.url)));
const bank=read("data/question-bank.zh-CN.json");
test("canonical JSON passes schema and semantic contracts",()=>{
 assert.equal(validateBank(bank).valid,true);
 assert.equal(validateProfiles(profiles).valid,true);
 assert.equal(bank.questions.length,questions.length);
 assert.deepEqual(bank.questions.map(x=>x.id),questions.map(x=>x.id));
});
test("schema rejects missing provenance and incorrect option type",()=>{
 const bad=structuredClone(bank);
 delete bad.questions[0].provenance;
 assert.equal(validateBank(bad).valid,false);
 const badWeight=structuredClone(bank);
 badWeight.questions[0].options[0].weight=999;
 assert.equal(validateBank(badWeight).valid,false);
});
test("semantic checks reject duplicate question ids, option ids, and mismatched letters",()=>{
 const bad=structuredClone(bank);bad.questions[1].id=bad.questions[0].id;
 assert.equal(validateBank(bad).valid,false);
 const badOption=structuredClone(bank);badOption.questions[0].options[1].id=badOption.questions[0].options[0].id;
 assert.equal(validateBank(badOption).valid,false);
 const letter=structuredClone(bank);letter.questions[0].options[0].letter="T";
 assert.equal(validateBank(letter).valid,false);
});
test("question reorder is score-compatible when ids and meanings stay stable",async()=>{
 const {evaluateAnswers}=await import("../../src/core/assessment.js");
 const answers=Object.fromEntries(questions.map(q=>[q.id,q.options[0].id]));
 assert.deepEqual(evaluateAnswers(questions,answers),evaluateAnswers([...questions].reverse(),answers));
});
test("migration refuses unreviewed version changes; accepts reviewed compatible answers",()=>{
 const record={version:"2.1.0",answers:{q01:"q01-a",q02:"missing"},index:42,finished:true};
 assert.equal(migrateProgress(questions,record,"2.1.0","2.2.0").status,"incompatible");
 const result=migrateProgress(questions,record,"2.1.0","2.2.0",["2.1.0->2.2.0"]);
 assert.equal(result.status,"partial");
 assert.equal(result.droppedAnswers,1);
 assert.equal(result.index,11);
 assert.equal(result.finished,false);
});
