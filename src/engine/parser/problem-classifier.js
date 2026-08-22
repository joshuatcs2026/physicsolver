import { parseProblem } from './problem-parser.js';

const TYPE_RULES=[
  {type:'constant-acceleration',terms:['accelerates','acceleration','from rest','velocity','time'],domain:'mechanics.kinematics'},
  {type:'force-dynamics',terms:['net force','force','newton','mass'],domain:'mechanics.dynamics'},
  {type:'energy',terms:['kinetic','potential energy','height','energy'],domain:'mechanics.energy'},
  {type:'momentum',terms:['momentum','collision','impulse'],domain:'mechanics.momentum'}
];

export function classifyProblem(text,options={}) {
  const parsed=parseProblem(text,options); const source=text.toLowerCase();
  const candidates=TYPE_RULES.map(rule=>({...rule,score:rule.terms.reduce((n,t)=>n+(source.includes(t)?1:0),0)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.type.localeCompare(b.type));
  return {primary:candidates[0]||null,candidates,domains:parsed.domains,parsed};
}
