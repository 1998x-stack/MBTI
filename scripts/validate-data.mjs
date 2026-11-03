import Ajv2020 from "ajv/dist/2020.js";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { AXES } from "../src/core/assessment.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => JSON.parse(readFileSync(resolve(root,name),"utf8"));
export function validateBank(bank,schema=read("schemas/question-bank.schema.json")) {
 const ajv=new Ajv2020({allErrors:true,strict:true});
 const valid=ajv.validate(schema,bank);
 const errors=(valid?[]:ajv.errors.map(e=>e.instancePath+" "+e.message));
 if(!valid) return {valid:false,errors};
 const ids=new Set(),opts=new Set(),counts=Object.fromEntries(AXES.map(a=>[a.id,0]));
 for(const q of bank.questions){
  if(ids.has(q.id))errors.push("Duplicate question id: "+q.id);
  ids.add(q.id);counts[q.axis]++;
  const axis=AXES.find(a=>a.id===q.axis);
  const sides={ [axis.left]:0,[axis.right]:0 };
  for(const o of q.options){
   if(opts.has(o.id))errors.push("Duplicate option id: "+o.id);
   opts.add(o.id);
   if(!o.id.startsWith(q.id+"-"))errors.push("Option ID points to another question: "+o.id);
   if(!Object.hasOwn(sides,o.letter))errors.push("Invalid dimension letter: "+o.id);
   else sides[o.letter]++;
  }
  if(sides[axis.left]!==2||sides[axis.right]!==2)errors.push("Expected 2+2 choice distribution: "+q.id);
 }
 for(const axis of AXES)if(counts[axis.id]!==3)errors.push("Expected 3 "+axis.id+" questions; got "+counts[axis.id]);
 return {valid:errors.length===0,errors,counts};
}
export function validateProfiles(profiles,schema=read("schemas/profile.schema.json")){
 const ajv=new Ajv2020({allErrors:true,strict:true});
 const valid=ajv.validate(schema,profiles);
 const errors=valid?[]:ajv.errors.map(e=>e.instancePath+" "+e.message);
 if(Object.keys(profiles).length!==16)errors.push("Expected exactly 16 profiles");
 for(const [type,p] of Object.entries(profiles))if(p.type!==type)errors.push("Profile key mismatch: "+type);
 return {valid:errors.length===0,errors};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
 const bank=read("data/question-bank.zh-CN.json");
 const result=validateBank(bank);
 const source=readFileSync(resolve(root,"src/data/profiles.js"),"utf8");
 const profileBody=source.split("export const profiles = ")[1].trim().replace(/;\s*$/,"");
 const profileResult=validateProfiles(JSON.parse(profileBody));
 if(!result.valid||!profileResult.valid){
  console.error([...result.errors,...profileResult.errors].join("\n"));
  process.exitCode=1;
 }else console.log("Validated",bank.questions.length,"questions and 16 profiles");
}
