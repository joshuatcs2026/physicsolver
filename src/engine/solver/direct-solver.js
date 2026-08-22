import { convert, createUnitIndex, sameDimensions } from '../../data/units/registry.js';

export function normalizeKnowns(raw = {}) {
  const knowns = new Map();
  for (const [id, entry] of Object.entries(raw)) {
    if (!entry || entry.value === '' || entry.value === null || entry.value === undefined) continue;
    const value = Number(entry.value);
    if (!Number.isFinite(value)) throw new Error(`Invalid numeric value for ${id}`);
    knowns.set(id, { value, unit: entry.unit || null });
  }
  return knowns;
}

export function unresolvedVariables(equation, knowns, constants = new Map()) {
  return equation.variables.filter(id => !knowns.has(id) && !constants.has(id));
}

export function findDirectCandidates(target, equations, knowns, constants = new Map()) {
  return equations
    .filter(eq => eq.variables.includes(target))
    .map(eq => ({ equation:eq, unresolved:unresolvedVariables(eq, knowns, constants) }))
    .filter(item => item.unresolved.length === 1 && item.unresolved[0] === target);
}

export function rankCandidates(candidates, target, context = {}) {
  return [...candidates].sort((a,b) => {
    const score = item => {
      const eq = item.equation;
      let value = 0;
      value += eq.complexity || 1;
      if (context.domains?.includes(eq.domain)) value -= 0.5;
      const keywordHits = (eq.keywords || []).filter(k => context.text?.toLowerCase().includes(k.toLowerCase())).length;
      value -= Math.min(keywordHits, 5) * 0.1;
      if (eq.targetMap?.[target]?.length) value += eq.targetMap[target].length * 0.01;
      return value;
    };
    return score(a) - score(b) || a.equation.id.localeCompare(b.equation.id);
  });
}

export function solveDirect(equation, target, knowns, constants = new Map()) {
  const get = id => knowns.get(id)?.value ?? constants.get(id)?.value;
  switch (equation.id) {
    case 'kinematics.velocity_time': {
      const vi=get('velocity_initial'), vf=get('velocity_final'), a=get('acceleration'), t=get('time');
      if (target==='velocity_final') return vi+a*t;
      if (target==='velocity_initial') return vf-a*t;
      if (target==='acceleration') return (vf-vi)/t;
      if (target==='time') return (vf-vi)/a;
      break;
    }
    case 'kinematics.displacement_velocity': {
      const dx=get('displacement'), vi=get('velocity_initial'), vf=get('velocity_final'), t=get('time');
      if (target==='displacement') return ((vi+vf)/2)*t;
      if (target==='velocity_initial') return 2*dx/t-vf;
      if (target==='velocity_final') return 2*dx/t-vi;
      if (target==='time') return 2*dx/(vi+vf);
      break;
    }
    case 'dynamics.newton_second': {
      const F=get('force'), m=get('mass'), a=get('acceleration');
      if (target==='force') return m*a;
      if (target==='mass') return F/a;
      if (target==='acceleration') return F/m;
      break;
    }
    case 'energy.kinetic': {
      const E=get('energy'), m=get('mass'), v=get('velocity_final');
      if (target==='energy') return 0.5*m*v*v;
      if (target==='mass') return 2*E/(v*v);
      if (target==='velocity_final') return Math.sqrt(2*E/m);
      break;
    }
    case 'energy.gravitational': {
      const E=get('energy'), m=get('mass'), h=get('height'), g=get('g0');
      if (target==='energy') return m*g*h;
      if (target==='mass') return E/(g*h);
      if (target==='height') return E/(m*g);
      break;
    }
    case 'momentum.linear': {
      const p=get('momentum'), m=get('mass'), v=get('velocity_final');
      if (target==='momentum') return m*v;
      if (target==='mass') return p/v;
      if (target==='velocity_final') return p/m;
      break;
    }
  }
  throw new Error(`Unsupported direct solve: ${equation.id} → ${target}`);
}

export function buildSubstitution(equation, target, knowns, constants = new Map()) {
  const inputs = {};
  for (const id of equation.targetMap[target] || []) {
    const entry = knowns.get(id) || constants.get(id);
    inputs[id] = entry ? {value:entry.value, unit:entry.unit || null} : null;
  }
  return { equationId:equation.id, target, expression:equation.expression, inputs };
}

export function checkDirectSolve({equation,target,knowns,result,variableIndex}) {
  const warnings=[];
  if (!Number.isFinite(result)) warnings.push('Result is not finite. Check division by zero or invalid input.');
  if (Number.isNaN(result)) warnings.push('Result is NaN.');
  const variable=variableIndex.byId.get(target);
  if (!variable) warnings.push(`Unknown target metadata: ${target}`);
  return {ok:warnings.length===0,warnings};
}

export function safeConvert(value, from, to, unitIndex=createUnitIndex()) {
  try { return {ok:true,value:convert(value,from,to,unitIndex)}; }
  catch(error) { return {ok:false,error:error.message}; }
}
