export const VARIABLES = Object.freeze([
  { id:'position', symbol:'x', name:'position', meaning:'Location measured along a chosen coordinate axis.', purpose:'Describes where an object is relative to the selected origin.', dimensions:{L:1}, commonUnits:['m','cm','km'], aliases:['displacement coordinate'] },
  { id:'displacement', symbol:'Δx', name:'displacement', meaning:'Change in position.', purpose:'Connects initial and final positions in motion problems.', dimensions:{L:1}, commonUnits:['m','cm','km'], aliases:['change in position'] },
  { id:'time', symbol:'t', name:'time', meaning:'Elapsed duration.', purpose:'Connects changing quantities to their rates of change.', dimensions:{T:1}, commonUnits:['s','min','h'], aliases:['elapsed time'] },
  { id:'velocity_initial', symbol:'v_i', name:'initial velocity', meaning:'Velocity at the beginning of the chosen interval.', purpose:'Starting state for kinematics equations.', dimensions:{L:1,T:-1}, commonUnits:['m/s','km/h'], aliases:['initial speed','u'] },
  { id:'velocity_final', symbol:'v_f', name:'final velocity', meaning:'Velocity at the end of the chosen interval.', purpose:'Target or ending state for kinematics equations.', dimensions:{L:1,T:-1}, commonUnits:['m/s','km/h'], aliases:['final speed','v'] },
  { id:'acceleration', symbol:'a', name:'acceleration', meaning:'Rate of change of velocity.', purpose:'Relates velocity changes to elapsed time.', dimensions:{L:1,T:-2}, commonUnits:['m/s²'], aliases:[] },
  { id:'mass', symbol:'m', name:'mass', meaning:'Measure of inertia.', purpose:'Connects forces, momentum, and energy to an object.', dimensions:{M:1}, commonUnits:['kg','g'], aliases:[] },
  { id:'force', symbol:'F', name:'force', meaning:'Interaction that can change motion.', purpose:'Used with mass and acceleration in dynamics.', dimensions:{M:1,L:1,T:-2}, commonUnits:['N'], aliases:[] },
  { id:'energy', symbol:'E', name:'energy', meaning:'Capacity represented by transferable or transformable physical quantities.', purpose:'Tracks mechanical, thermal, electrical, and other processes.', dimensions:{M:1,L:2,T:-2}, commonUnits:['J','kJ'], aliases:[] },
  { id:'work', symbol:'W', name:'work', meaning:'Energy transferred by a force through displacement.', purpose:'Connects force, displacement, and energy change.', dimensions:{M:1,L:2,T:-2}, commonUnits:['J'], aliases:[] },
  { id:'power', symbol:'P', name:'power', meaning:'Rate of energy transfer.', purpose:'Relates work or energy change to time.', dimensions:{M:1,L:2,T:-3}, commonUnits:['W','kW'], aliases:[] },
  { id:'momentum', symbol:'p', name:'momentum', meaning:'Mass multiplied by velocity.', purpose:'Used for motion and conservation analyses.', dimensions:{M:1,L:1,T:-1}, commonUnits:['kg·m/s'], aliases:[] },
  { id:'height', symbol:'h', name:'height', meaning:'Vertical coordinate or elevation.', purpose:'Used for gravitational potential energy and vertical motion.', dimensions:{L:1}, commonUnits:['m'], aliases:['altitude'] },
  { id:'angle', symbol:'θ', name:'angle', meaning:'Angular measure between selected directions.', purpose:'Resolves vectors and describes rotation.', dimensions:{}, commonUnits:['rad','deg'], aliases:['theta'] }
]);

export function createVariableIndex(variables = VARIABLES) {
  const byId = new Map();
  const byAlias = new Map();
  for (const variable of variables) {
    byId.set(variable.id, variable);
    for (const key of [variable.symbol, variable.name, ...variable.aliases]) {
      byAlias.set(String(key).toLowerCase(), variable.id);
    }
  }
  return Object.freeze({ byId, byAlias });
}
