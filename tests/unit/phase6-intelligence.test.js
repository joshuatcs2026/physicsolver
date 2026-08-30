import assert from 'node:assert/strict';
import { buildDependencyGraph, countUnknowns, rankEquations, detectCircularDependencies, findShortestSolvePaths, makeSolvePlan } from '../../src/engine/intelligence/solve-planner.js';
import { SOLVER_MODES, prepareMode } from '../../src/engine/intelligence/mode-engine.js';

const eqs=[
 {id:'a',variables:['v','d','t'],domain:'kinematics',priority:2},
 {id:'b',variables:['d','v','t'],domain:'kinematics',priority:1},
 {id:'c',variables:['F','m','a'],domain:'dynamics',priority:2}
];
assert.equal(countUnknowns(eqs[0],{d:10,t:2}),1);
assert.ok(buildDependencyGraph(eqs).get('v').has('d'));
assert.equal(rankEquations(eqs,{knowns:{d:10,t:2},target:'v',domain:'kinematics'})[0].equation.id,'a');
const paths=findShortestSolvePaths(eqs,{d:10,t:2},'v');
assert.ok(paths.length>=1);
assert.equal(detectCircularDependencies(eqs).hasCycle,false);
const cycle=detectCircularDependencies([{id:'x',variables:['a','b']},{id:'y',variables:['b','a']}]);
assert.equal(cycle.hasCycle,true);
const plan=makeSolvePlan({equations:eqs,knowns:{d:10,t:2},target:'v',domain:'kinematics'});
assert.equal(plan.status,'ready');
assert.ok(plan.directCandidates.length>=1);
assert.equal(prepareMode(SOLVER_MODES.PATH).mode,'path');
console.log('phase 6 intelligence tests passed');
