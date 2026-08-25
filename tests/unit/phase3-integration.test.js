import assert from 'node:assert/strict';
import { analyzeProblem } from '../../src/app/solver-controller.js';

const ohm=analyzeProblem({knowns:{I:{value:3,unit:'A'},R:{value:4,unit:'ohm'}},target:'V'});
assert.equal(ohm.status,'solved');
assert.ok(Math.abs(ohm.result-12)<1e-6);

const kinetic=analyzeProblem({knowns:{K:{value:18,unit:'J'},m:{value:4,unit:'kg'}},target:'v'});
assert.equal(kinetic.status,'solved');
assert.ok(Math.abs(Math.abs(kinetic.result)-3)<1e-5);

const alreadyKnown=analyzeProblem({knowns:{v:{value:9,unit:'m/s'}},target:'v'});
assert.equal(alreadyKnown.status,'solved');
assert.equal(alreadyKnown.result,9);
console.log('phase 3 application integration tests passed');
