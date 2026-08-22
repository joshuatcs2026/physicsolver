export const EQUATIONS = Object.freeze([
  {id:'kinematics.velocity_time',name:'Velocity-time relation',domain:'mechanics.kinematics',expression:'vf = vi + a*t',variables:['velocity_final','velocity_initial','acceleration','time'],targetMap:{velocity_final:['velocity_initial','acceleration','time'],velocity_initial:['velocity_final','acceleration','time'],acceleration:['velocity_final','velocity_initial','time'],time:['velocity_final','velocity_initial','acceleration']},keywords:['accelerates','velocity','time','speed'],assumptions:['constant acceleration'],complexity:1},
  {id:'kinematics.displacement_velocity',name:'Displacement from average velocity',domain:'mechanics.kinematics',expression:'dx = ((vi + vf)/2)*t',variables:['displacement','velocity_initial','velocity_final','time'],targetMap:{displacement:['velocity_initial','velocity_final','time'],velocity_initial:['displacement','velocity_final','time'],velocity_final:['displacement','velocity_initial','time'],time:['displacement','velocity_initial','velocity_final']},keywords:['displacement','distance','average velocity'],assumptions:['constant acceleration'],complexity:1},
  {id:'dynamics.newton_second',name:'Newton second law',domain:'mechanics.dynamics',expression:'F = m*a',variables:['force','mass','acceleration'],targetMap:{force:['mass','acceleration'],mass:['force','acceleration'],acceleration:['force','mass']},keywords:['force','mass','acceleration','net force'],assumptions:['net force in selected direction'],complexity:1},
  {id:'energy.kinetic',name:'Kinetic energy',domain:'mechanics.energy',expression:'KE = 0.5*m*v^2',variables:['energy','mass','velocity_final'],targetMap:{energy:['mass','velocity_final'],mass:['energy','velocity_final'],velocity_final:['energy','mass']},keywords:['kinetic','energy','speed'],assumptions:['classical mechanics'],complexity:1},
  {id:'energy.gravitational',name:'Near-Earth gravitational potential energy',domain:'mechanics.energy',expression:'Ug = m*g*h',variables:['energy','mass','height'],constants:['g0'],targetMap:{energy:['mass','height'],mass:['energy','height'],height:['energy','mass']},keywords:['height','gravity','potential energy'],assumptions:['approximately uniform gravitational field'],complexity:1},
  {id:'momentum.linear',name:'Linear momentum',domain:'mechanics.momentum',expression:'p = m*v',variables:['momentum','mass','velocity_final'],targetMap:{momentum:['mass','velocity_final'],mass:['momentum','velocity_final'],velocity_final:['momentum','mass']},keywords:['momentum','collision','mass','velocity'],assumptions:[],complexity:1}
]);

export function createEquationIndex(equations = EQUATIONS) {
  const byId = new Map();
  const byVariable = new Map();
  const byDomain = new Map();
  for (const equation of equations) {
    byId.set(equation.id, equation);
    for (const variable of equation.variables) {
      if (!byVariable.has(variable)) byVariable.set(variable, []);
      byVariable.get(variable).push(equation.id);
    }
    if (!byDomain.has(equation.domain)) byDomain.set(equation.domain, []);
    byDomain.get(equation.domain).push(equation.id);
  }
  return Object.freeze({byId, byVariable, byDomain});
}
