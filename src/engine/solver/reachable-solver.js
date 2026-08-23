import { EQUATIONS } from '../../data/equations/registry.js';
import { normalizeKnowns, solveDirect } from './direct-solver.js';

export function solveReachable({knowns:rawKnowns={},target=null,equations=EQUATIONS,constants=new Map(),maxPasses=32}={}){
  const knowns=normalizeKnowns(rawKnowns),steps=[],failures=[];
  for(let pass=0;pass<maxPasses;pass++){
    let changed=false;
    for(const equation of equations)for(const candidate of Object.keys(equation.targetMap||{})){
      if(knowns.has(candidate))continue;
      const dependencies=equation.targetMap[candidate]||[];
      if(!dependencies.every(key=>knowns.has(key)||constants.has(key)))continue;
      try{const value=solveDirect(equation,candidate,knowns,constants);if(Number.isFinite(value)){knowns.set(candidate,value);steps.push({pass,equationId:equation.id,target:candidate,dependencies,value});changed=true;}}
      catch(error){failures.push({equationId:equation.id,target:candidate,message:error.message});}
    }
    if((target&&knowns.has(target))||!changed)break;
  }
  const values=Object.fromEntries(knowns);
  return {status:target?(knowns.has(target)?'solved':'partial'):(steps.length?'solved':'blocked'),target,targetValue:target?knowns.get(target):undefined,values,steps,solved:Object.keys(values),failures};
}

export function findReachableTargets(options={}){return solveReachable(options).steps.map(({target,equationId,value})=>({target,equationId,value}));}
