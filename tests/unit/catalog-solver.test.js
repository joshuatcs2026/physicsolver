import assert from 'node:assert/strict';
import { candidates, solveCatalogTarget, solveCatalogReachable, explainCatalogSolution } from '../../src/engine/solver/catalog-solver.js';

const ohm=candidates({I:3,R:4},'V');
assert.ok(ohm.some(x=>x.id==='elec.ohm'));
const voltage=solveCatalogTarget({knowns:{I:3,R:4},target:'V',options:{min:-100,max:100}});
assert.ok(Math.abs(voltage.solutions[0]-12)<1e-6);
const reachable=solveCatalogReachable({knowns:{m:2,v:5,r:3},target:'F',options:{min:-1000,max:1000}});
assert.ok(Number.isFinite(reachable.knowns.p));
assert.ok(Number.isFinite(reachable.knowns.K));
assert.ok(Number.isFinite(reachable.knowns.F));
assert.equal(reachable.found,true);
assert.ok(explainCatalogSolution(voltage).length>=2);
console.log('catalog solver tests passed');
