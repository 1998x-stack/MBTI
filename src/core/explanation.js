import { AXES } from "./assessment.js";
export const EXPLANATION_VERSION="2.2.0";
/** Structured explainability: deterministic source questions and original choices. */
export function explainAssessment(bank,answers,assessment){
 if(!assessment?.completed) return {version:EXPLANATION_VERSION,completed:false,summary:"尚未完成全部题目",axes:[]};
 const axes=AXES.map(axis=>{
  const score=assessment.axes.find(x=>x.id===axis.id);
  const evidence=bank.filter(q=>q.axis===axis.id).map(q=>{
   const option=q.options.find(o=>o.id===answers?.[q.id]);
   return {questionId:q.id,title:q.title,scenario:q.scenario,
     optionId:option?.id??null,selected:option?.label??"未回答",
     letter:option?.letter??null,weight:option?.weight??0};
  });
  const leftChoices=evidence.filter(e=>e.letter===axis.left).length;
  const rightChoices=evidence.filter(e=>e.letter===axis.right).length;
  const preferred=score.preference===axis.left?axis.leftName:score.preference===axis.right?axis.rightName:"两侧";
  const narrative=!score.preference
   ? "这一维度的加权得分持平；不据此强制判定某一侧。"
   : "按本问卷的内部计分规则，本次答案更偏向"+preferred+"，并不意味着能力或人格强度。";
  return {...axis,preference:score.preference,leftScore:score.leftScore,rightScore:score.rightScore,
   leftChoices,rightChoices,evidence,narrative,margin:Math.abs(score.leftScore-score.rightScore)};
 });
 const named=axes.filter(a=>a.preference).map(a=>a.preference===a.left?a.leftName:a.rightName);
 const summary=assessment.type
  ? "在本次十二道日常情境中，你的选择相对偏向"+named.join("、")+"。这些是当前问卷的选择线索，而不是对你的固定定义。"
  : "至少一个维度的加权选择持平。这是正常的结果，无须强行归入某一组四字母类型。";
 return {version:EXPLANATION_VERSION,completed:true,type:assessment.type,summary,axes,
  limitations:["本问卷仅供娱乐和自我探索，不是官方 MBTI 或经验证的心理测评。",
   "选择次数与内部权重只是此次作答记录；不代表人格概率、准确率或心理学置信度。",
   "同一人可能因情境、经历或时间而作出不同选择。"]};
}
