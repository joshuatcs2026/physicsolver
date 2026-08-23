import assert from 'node:assert/strict';
import { physicsTools, runPhysicsTool } from '../../src/engine/tools/physics-tools.js';
import { PHASE2_EXPANDED_EQUATIONS } from '../../src/data/equations/phase2-expanded.js';
import { analyzeEquationSystem, discoverSolvableQuantities, availablePhysicsTools } from '../../src/app/phase2-controller.js';

const vector=physicsTools.vector({magnitude:10,angleDeg:0});assert.ok(Math.abs(vector.x-10)<1e-10);assert.ok(Math.abs(vector.y)<1e-10);
const result=physicsTools.resultant({x:3,y:4});assert.equal(result.magnitude,5);
assert.deepEqual(physicsTools.midpoint({x1:0,y1:0,x2:4,y2:6}),{x:2,y:3});
assert.equal(physicsTools.distance({x1:0,y1:0,x2:3,y2:4}),5);
assert.equal(runPhysicsTool('kineticEnergy',{m:2,v:3}),9);
assert.throws(()=>runPhysicsTool('missing',{}));
assert.ok(availablePhysicsTools().includes('projectile'));
assert.ok(PHASE2_EXPANDED_EQUATIONS.length>=40);
assert.equal(new Set(PHASE2_EXPANDED_EQUATIONS.map(x=>x.id)).size,PHASE2_EXPANDED_EQUATIONS.length);
for(const eq of PHASE2_EXPANDED_EQUATIONS){assert.ok(eq.id&&eq.expression&&eq.variables.length>=2);}
const reachable=discoverSolvableQuantities({knowns:{m:2,v:3}});assert.ok(Array.isArray(reachable));
const system=analyzeEquationSystem({knowns:{m:2,v:3}});assert.ok(system.status==='solved'||system.status==='blocked'||system.status==='partial');
console.log('Phase 2 equation engine tests passed.');
