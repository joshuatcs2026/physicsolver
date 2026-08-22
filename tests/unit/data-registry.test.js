import { VARIABLES, createVariableIndex } from '../../src/data/variables/registry.js';
import { UNITS, convert, createUnitIndex, sameDimensions } from '../../src/data/units/registry.js';
import { CONSTANTS, createConstantIndex } from '../../src/data/constants/registry.js';
import { EQUATIONS, createEquationIndex } from '../../src/data/equations/registry.js';
import { validateRegistry } from '../../src/data/schemas/validate.js';

const fail = message => { throw new Error(message); };
const assert = (condition, message) => { if (!condition) fail(message); };
const near = (actual, expected, tolerance=1e-10) => assert(Math.abs(actual-expected) <= tolerance, `${actual} != ${expected}`);

const variableIndex = createVariableIndex();
assert(variableIndex.byId.size === VARIABLES.length, 'Variable IDs must be unique');
assert(variableIndex.byAlias.get('time') === 'time', 'Alias lookup failed');

const unitIndex = createUnitIndex();
near(convert(1,'km','m',unitIndex),1000);
near(convert(60,'min','h',unitIndex),1);
near(convert(180,'deg','rad',unitIndex),Math.PI);
assert(sameDimensions({L:1,T:-1},{L:1,T:-1}), 'Dimension equality failed');
let incompatible = false; try { convert(1,'m','s',unitIndex); } catch { incompatible = true; }
assert(incompatible, 'Incompatible units must throw');

const equationIndex = createEquationIndex();
assert(equationIndex.byId.size === EQUATIONS.length, 'Equation IDs must be unique');
assert(equationIndex.byVariable.get('mass').length >= 1, 'Variable equation index failed');
assert(createConstantIndex().size === CONSTANTS.length, 'Constant index failed');

const errors = validateRegistry({variables:VARIABLES,equations:EQUATIONS,constants:CONSTANTS});
assert(errors.length === 0, `Registry validation errors: ${errors.join(', ')}`);
console.log('Phase 1 data registry tests passed');
