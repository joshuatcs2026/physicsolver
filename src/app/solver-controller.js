import { EQUATIONS } from '../data/equations/registry.js';
import { PHASE1_EQUATIONS } from '../data/equations/phase1-catalog.js';
import { VARIABLES, createVariableIndex } from '../data/variables/registry.js';
import { CONSTANTS, createConstantIndex } from '../data/constants/registry.js';
import { normalizeKnowns, findDirectCandidates, rankCandidates } from '../engine/solver/direct-solver.js';
import { findSolvePaths, selectShortestPath, alternativePaths } from '../engine/solver/pathfinder.js';
import { executeSolvePath } from '../engine/solver/path-executor.js';
import { solveCatalogTarget, solveCatalogReachable } from '../engine/solver/catalog-solver.js';
const variableIndex=createVariableIndex(VARIABLES),constants=createConstantIndex(CONSTANTS);
function legacyResult(knowns,target,text,domains,maxDepth){
 const direct=rankCandidates(findDirectCandidates(target,EQUATIONS,knowns,constants),target,{text,domains});
 if(direct.length){const path={steps:[{equationId:direct[0].equation.id,target,dependencies:direct[0].equation.targetMap[target]}],equationCount:1,dependencyDepth:1};const execution=executeSolvePath({path,equations:EQUATIONS,knowns,constants,variableIndex});return{...execution,mode:'direct',path,alternatives:direct.slice(1).map(x=>x.equation.id)};}
 const search=findSolvePaths({target,equations:EQUATIONS,knownIds:new Set(knowns.keys()),maxDepth});const shortest=selectShortestPath(search);if(!shortest)return{status:'blocked',message:'No valid dependency path reaches the requested target.',blocked:search.blocked,alternatives:[]};const execution=executeSolvePath({path:shortest,equations:EQUATIONS,knowns,constants,variableIndex});return{...execution,mode:'dependency',path:shortest,alternatives:alternativePaths(search),blocked:search.blocked};
}
export function analyzeProblem({knowns:rawKnowns,target,text='',domains=[],maxDepth=8}){
 const knowns=normalizeKnowns(rawKnowns,variableIndex);
 if(knowns.has(target))return{status:'solved',message:'Target is already supplied as a known value.',result:knowns.get(target).value,unit:knowns.get(target).unit,trace:[]};
 const legacy=legacyResult(knowns,target,text,domains,maxDepth);
 if(legacy.status==='solved'||legacy.status==='warning')return legacy;
 const values={};for(const [id,data] of knowns)values[id]=data.value;
 const general=solveCatalogTarget({knowns:values,target,equations:PHASE1_EQUATIONS,options:{min:-1e5,max:1e5}});
 if(general.solutions?.length)return{status:'solved',result:general.solutions[0],unit:variableIndex.get(target)?.commonUnits?.[0]||null,mode:'general-catalog',message:'Solved using the Phase 3 general equation engine.',trace:[{target,targetName:variableIndex.get(target)?.name||target,expression:general.equation.expression,result:general.solutions[0],unit:variableIndex.get(target)?.commonUnits?.[0]||null,equationId:general.equation.id}],path:{steps:[{equationId:general.equation.id,target}],equationCount:1,dependencyDepth:1},alternatives:general.attempts?.filter(x=>x.solutions?.length).slice(1).map(x=>x.equation.id)||[]};
 const reachable=solveCatalogReachable({knowns:values,target,equations:PHASE1_EQUATIONS,options:{min:-1e5,max:1e5}});
 if(reachable.found&&Number.isFinite(reachable.knowns[target]))return{status:'solved',result:reachable.knowns[target],unit:variableIndex.get(target)?.commonUnits?.[0]||null,mode:'general-recursive',message:'Solved through recursive equation discovery.',trace:reachable.steps.map(s=>({target:s.variable,targetName:variableIndex.get(s.variable)?.name||s.variable,expression:s.expression,result:s.value,unit:variableIndex.get(s.variable)?.commonUnits?.[0]||null,equationId:s.equationId})),path:{steps:reachable.steps.map(s=>({equationId:s.equationId,target:s.variable})),equationCount:reachable.steps.length,dependencyDepth:reachable.steps.length},alternatives:[]};
 return legacy;
}
