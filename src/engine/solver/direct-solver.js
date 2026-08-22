import { convert, createUnitIndex, normalizeToBase } from '../../data/units/registry.js';
import { checkQuantityDimensions, sanityCheck } from '../validation/dimensional-analysis.js';

export function normalizeKnowns(raw={},variableIndex=null,unitIndex=createUnitIndex()){
 const knowns=new Map();
 for(const [id,entry] of Object.entries(raw)){
  if(!entry||entry.value===''||entry.value===null||entry.value===undefined)continue;
  const numeric=Number(entry.value);if(!Number.isFinite(numeric))throw new Error(`Invalid numeric value for ${id}`);
  const variable=variableIndex?.byId?.get(id);let normalized={value:numeric,unit:entry.unit||null};
  if(entry.unit){const base=normalizeToBase(numeric,entry.unit,unitIndex);const check=checkQuantityDimensions({variable,dimensions:base.dimensions});if(!check.ok)throw new Error(`${id}: ${check.warnings.join(' ')}`);normalized={value:base.value,unit:variable?.commonUnits?.[0]||entry.unit,sourceUnit:entry.unit};}
  knowns.set(id,normalized);
 }return knowns;
}
export function unresolvedVariables(equation,knowns,constants=new Map()){return equation.variables.filter(id=>!knowns.has(id)&&!constants.has(id));}
export function findDirectCandidates(target,equations,knowns,constants=new Map()){return equations.filter(eq=>eq.variables.includes(target)).map(equation=>({equation,unresolved:unresolvedVariables(equation,knowns,constants)})).filter(x=>x.unresolved.length===1&&x.unresolved[0]===target);}
export function rankCandidates(candidates,target,context={}){return [...candidates].sort((a,b)=>{const score=item=>{const eq=item.equation;let value=eq.complexity||1;if(context.domains?.includes(eq.domain))value-=.5;const text=(context.text||'').toLowerCase();value-=Math.min((eq.keywords||[]).filter(k=>text.includes(k.toLowerCase())).length,5)*.1;value+=(eq.targetMap?.[target]?.length||0)*.01;return value;};return score(a)-score(b)||a.equation.id.localeCompare(b.equation.id);});}
const divide=(a,b,label)=>{if(b===0)throw new Error(`Division by zero while solving ${label}`);return a/b;};
const root=x=>{if(x<0)throw new Error('Square root received a negative value. Check inputs or physical assumptions.');return Math.sqrt(x);};
export function solveDirect(equation,target,knowns,constants=new Map()){const get=id=>knowns.get(id)?.value??constants.get(id)?.value;switch(equation.id){
case'kinematics.velocity_time':{const vi=get('velocity_initial'),vf=get('velocity_final'),a=get('acceleration'),t=get('time');if(target==='velocity_final')return vi+a*t;if(target==='velocity_initial')return vf-a*t;if(target==='acceleration')return divide(vf-vi,t,'acceleration');if(target==='time')return divide(vf-vi,a,'time');break;}
case'kinematics.displacement_velocity':{const dx=get('displacement'),vi=get('velocity_initial'),vf=get('velocity_final'),t=get('time');if(target==='displacement')return((vi+vf)/2)*t;if(target==='velocity_initial')return 2*divide(dx,t,'initial velocity')-vf;if(target==='velocity_final')return 2*divide(dx,t,'final velocity')-vi;if(target==='time')return divide(2*dx,vi+vf,'time');break;}
case'dynamics.newton_second':{const F=get('force'),m=get('mass'),a=get('acceleration');if(target==='force')return m*a;if(target==='mass')return divide(F,a,'mass');if(target==='acceleration')return divide(F,m,'acceleration');break;}
case'energy.kinetic':{const E=get('energy'),m=get('mass'),v=get('velocity_final');if(target==='energy')return .5*m*v*v;if(target==='mass')return divide(2*E,v*v,'mass');if(target==='velocity_final')return root(divide(2*E,m,'velocity'));break;}
case'energy.gravitational':{const E=get('energy'),m=get('mass'),h=get('height'),g=get('g0');if(target==='energy')return m*g*h;if(target==='mass')return divide(E,g*h,'mass');if(target==='height')return divide(E,m*g,'height');break;}
case'momentum.linear':{const p=get('momentum'),m=get('mass'),v=get('velocity_final');if(target==='momentum')return m*v;if(target==='mass')return divide(p,v,'mass');if(target==='velocity_final')return divide(p,m,'velocity');break;}}
throw new Error(`Unsupported direct solve: ${equation.id} → ${target}`);}
export function buildSubstitution(equation,target,knowns,constants=new Map()){const inputs={};for(const id of equation.targetMap[target]||[]){const entry=knowns.get(id)||constants.get(id);inputs[id]=entry?{value:entry.value,unit:entry.unit||null}:null;}return{equationId:equation.id,target,expression:equation.expression,inputs};}
export function checkDirectSolve({equation,target,knowns,result,variableIndex}){const warnings=[];if(!Number.isFinite(result))warnings.push('Result is not finite.');const variable=variableIndex.byId.get(target);if(!variable)warnings.push(`Unknown target metadata: ${target}`);else warnings.push(...sanityCheck({variable,value:result}).warnings);return{ok:warnings.length===0,warnings};}
export function safeConvert(value,from,to,unitIndex=createUnitIndex()){try{return{ok:true,value:convert(value,from,to,unitIndex)}}catch(error){return{ok:false,error:error.message}}}
