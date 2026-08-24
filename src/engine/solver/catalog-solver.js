import { PHASE1_EQUATIONS } from '../../data/equations/phase1-catalog.js';
import { solveExpression } from './general-solver.js';

export function normalizeKnowns(knowns={}){
  const values={};
  for(const [key,value] of Object.entries(knowns)){
    const n=typeof value==='number'?value:Number(value?.value??value);
    if(Number.isFinite(n))values[key]=n;
  }
  return values;
}

export function candidates(knowns,target=null,equations=PHASE1_EQUATIONS){
  const k=normalizeKnowns(knowns);
  return equations.filter(eq=>{
    if(target&&!eq.variables.includes(target))return false;
    const missing=eq.variables.filter(v=>!Number.isFinite(k[v]));
    return missing.length===1||(target&&missing.includes(target)&&missing.length===1);
  });
}

function rootScore(value,variable){
  if(!Number.isFinite(value))return -Infinity;
  if(['m','d','t','r','R','rho','V','P','E','K','U','f','lambda','n','N','Q','C','L'].includes(variable)&&value<0)return -1;
  return 1;
}

export function solveCatalogTarget({knowns={},target,equations=PHASE1_EQUATIONS,options={}}={}){
  if(!target)throw new Error('Target is required');
  const values=normalizeKnowns(knowns), usable=candidates(values,target,equations), attempts=[];
  for(const equation of usable){
    try{
      const result=solveExpression(equation.expression,values,target,options);
      const solutions=result.solutions.filter(x=>rootScore(x,target)>=0);
      attempts.push({equation,solutions});
      if(solutions.length)return {target,solutions,equation,method:result.method,attempts,step:{expression:equation.expression,knowns:values}};
    }catch(error){attempts.push({equation,error:error.message,solutions:[]});}
  }
  return {target,solutions:[],equation:null,method:null,attempts,reason:'No catalog equation produced a valid solution'};
}

export function solveCatalogReachable({knowns={},target=null,equations=PHASE1_EQUATIONS,maxPasses=50,options={}}={}){
  const values=normalizeKnowns(knowns), steps=[];
  for(let pass=0;pass<maxPasses;pass++){
    let progress=false;
    for(const equation of equations){
      const missing=equation.variables.filter(v=>!Number.isFinite(values[v]));
      if(missing.length!==1)continue;
      const variable=missing[0], result=solveCatalogTarget({knowns:values,target:variable,equations:[equation],options});
      if(result.solutions.length){const value=result.solutions[0];if(!Number.isFinite(values[variable])){values[variable]=value;steps.push({variable,value,equationId:equation.id,expression:equation.expression,method:result.method});progress=true;if(target===variable)return {knowns:values,steps,target,found:true};}}
    }
    if(!progress)break;
  }
  return {knowns:values,steps,target,found:target?Number.isFinite(values[target]):true};
}

export function explainCatalogSolution(result){
  if(!result?.equation)return [];
  return [{type:'equation',text:result.equation.expression},{type:'knowns',values:result.step.knowns},{type:'result',variable:result.target,solutions:result.solutions}];
}
