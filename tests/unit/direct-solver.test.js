import { normalizeKnowns, findDirectCandidates, solveDirect, buildSubstitution } from '../../src/engine/solver/direct-solver.js';
import { detectOneUnknownEquations, countUnknowns } from '../../src/engine/solver/one-unknown.js';
import { EQUATIONS } from '../../src/data/equations/registry.js';
import { CONSTANTS, createConstantIndex } from '../../src/data/constants/registry.js';

const assert=(condition,message)=>{if(!condition)throw new Error(message)};
const near=(a,b,e=1e-9)=>assert(Math.abs(a-b)<=e,`${a} != ${b}`);
const constants=createConstantIndex(CONSTANTS);

let knowns=normalizeKnowns({velocity_initial:{value:5},acceleration:{value:2},time:{value:3}});
let candidates=findDirectCandidates('velocity_final',EQUATIONS,knowns,constants);
assert(candidates.length===1,'Expected direct velocity candidate');
near(solveDirect(candidates[0].equation,'velocity_final',knowns,constants),11);
assert(countUnknowns(candidates[0].equation,knowns,constants)===1,'Expected one unknown');

knowns=normalizeKnowns({force:{value:20},mass:{value:4}});
const newton=EQUATIONS.find(x=>x.id==='dynamics.newton_second');
near(solveDirect(newton,'acceleration',knowns,constants),5);

knowns=normalizeKnowns({energy:{value:18},mass:{value:4}});
const kinetic=EQUATIONS.find(x=>x.id==='energy.kinetic');
near(solveDirect(kinetic,'velocity_final',knowns,constants),3);

knowns=normalizeKnowns({mass:{value:2},height:{value:10}});
const grav=EQUATIONS.find(x=>x.id==='energy.gravitational');
near(solveDirect(grav,'energy',knowns,constants),196.133);
const substitution=buildSubstitution(grav,'energy',knowns,constants);
assert(substitution.inputs.mass.value===2,'Substitution mass missing');
assert(substitution.inputs.height.value===10,'Substitution height missing');

const work=EQUATIONS.find(x=>x.id==='energy.work');
const workKnowns=normalizeKnowns({work:{value:50},force_applied:{value:10},displacement:{value:10}});
near(solveDirect(work,'angle',workKnowns,constants),Math.PI/3);

const oneUnknown=detectOneUnknownEquations(EQUATIONS,knowns,constants);
assert(oneUnknown.some(x=>x.equation.id==='energy.gravitational'),'One-unknown detector missed gravitational energy');

console.log('Phase 2 direct solver tests passed');
