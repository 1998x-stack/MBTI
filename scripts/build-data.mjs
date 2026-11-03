import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { validateBank } from "./validate-data.mjs";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const source=readFileSync(resolve(root,"data/question-bank.zh-CN.json"),"utf8");
const bank=JSON.parse(source);
const result=validateBank(bank);
if(!result.valid)throw new Error("Invalid bank:\n"+result.errors.join("\n"));
const questions=bank.questions.map(({revision,provenance,...question})=>question);
const generated=[
 "// GENERATED FILE: run npm run build:data; edit data/question-bank.zh-CN.json instead.",
 "export const QUESTION_BANK_VERSION = "+JSON.stringify(bank.bankVersion)+";",
 "export const SCORING_VERSION = "+JSON.stringify(bank.scoringVersion)+";",
 "export const questions = "+JSON.stringify(questions,null,2)+";",
 ""
].join("\n");
const filename=resolve(root,"src/data/questions.js");
if(process.argv.includes("--check")){
 if(readFileSync(filename,"utf8")!==generated)throw new Error("questions.js drifted from canonical JSON");
 console.log("Question ESM is current");
}else{
 writeFileSync(filename,generated);
 console.log("Generated",filename);
}
const checksum=createHash("sha256").update(JSON.stringify(bank)).digest("hex");
console.log("Question bank SHA-256:",checksum);
