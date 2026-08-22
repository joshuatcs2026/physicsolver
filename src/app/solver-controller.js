import { EQUATIONS } from '../data/equations/registry.js';
import { VARIABLES, createVariableIndex } from '../data/variables/registry.js';
import { CONSTANTS, createConstantIndex } from '../data/constants/registry.js';
import { normalizeKnowns, findDirectCandidates, rankCandidates } from '../engine/solver/direct-solver.js';
import { findSolvePaths, selectShortestPath, alternativePaths } from '../engine/solver/pathfinder.js';
import { executeSolvePath } from '../engine/solver/path-executor.js';
const variableIndex=createVariableIndex(VARIABLES),constants=createConstantIndex(CONSTANTS);
export function analyzeProblem({knowns:rawKnowns,target,text='',domains=[],maxDepth=8}){
 const knowns=normalizeKnowns(rawKnowns,variableIndex);
 if(knowns.has(target))return{status:'solved',message:'Target is already supplied as a known value.',result:knowns.get(target).value,unit:knowns.get(target).unit,trace:[]};
 const direct=rankCandidates(findDirectCandidates(target,EQUATIONS,knowns,constants),target,{text,domains});
 if(direct.length){const path={steps:[{equationId:direct[0].equation.id,target,dependencies:direct[0].equation.targetMap[target]}],equationCount:1,dependencyDepth:1};const execution=executeSolvePath({path,equations:EQUATIONS,knowns,constants,variableIndex});return{...execution,mode:'direct',path,alternatives:direct.slice(1).map(x=>x.equation.id)};}
 const search=findSolvePaths({target,equations:EQUATIONS,knownIds:new Set(knowns.keys()),maxDepth});const shortest=selectShortestPath(search);if(!shortest)return{status:'blocked',message:'No valid dependency path reaches the requested target.',blocked:search.blocked,alternatives:[]};const execution=executeSolvePath({path:shortest,equations:EQUATIONS,knowns,constants,variableIndex});return{...execution,mode:'dependency',path:shortest,alternatives:alternativePaths(search),blocked:search.blocked};
}
