import { safeRestoreAnswers } from "./assessment.js";
/** Only allow cross-version progress restore after explicit semantic compatibility review. */
export function migrateProgress(bank,record,fromVersion,toVersion,compatiblePairs=[]) {
 if(!record||typeof record!=="object"||Array.isArray(record))
  return {status:"invalid",answers:{},index:0,finished:false};
 if(fromVersion!==toVersion&&!compatiblePairs.includes(fromVersion+"->"+toVersion))
  return {status:"incompatible",answers:{},index:0,finished:false};
 const answers=safeRestoreAnswers(bank,record.answers);
 const original=(record.answers&&typeof record.answers==="object"&&!Array.isArray(record.answers))?Object.keys(record.answers).length:0;
 const dropped=original-Object.keys(answers).length;
 const index=Number.isInteger(record.index)?Math.min(Math.max(0,record.index),bank.length-1):0;
 return {status:dropped>0?"partial":"compatible",answers,index,
   finished:record.finished===true&&Object.keys(answers).length===bank.length,
   droppedAnswers:Math.max(0,dropped)};
}
