import { solveDirect, buildSubstitution, checkDirectSolve } from './direct-solver.js';

export function executeSolvePath({path, equations, knowns, constants, variableIndex}) {
  const equationById=new Map(equations.map(eq=>[eq.id,eq]));
  const values=new Map(knowns);
  const trace=[];
  for (const step of path.steps) {
    if (values.has(step.target)) continue;
    const equation=equationById.get(step.equationId);
    if (!equation) return {status:'error',message:`Missing equation ${step.equationId}`,trace};
    const missing=(equation.targetMap[step.target]||[]).filter(id=>!values.has(id) && !constants.has(id));
    if (missing.length) return {status:'blocked',message:`Step ${step.target} still needs ${missing.join(', ')}`,trace};
    try {
      const substitution=buildSubstitution(equation,step.target,values,constants);
      const result=solveDirect(equation,step.target,values,constants);
      const check=checkDirectSolve({equation,target:step.target,knowns:values,result,variableIndex});
      values.set(step.target,{value:result,unit:null,derived:true});
      trace.push({equationId:equation.id,target:step.target,expression:equation.expression,substitution,result,check});
      if (!check.ok) return {status:'warning',message:'A calculated step produced warnings.',trace,values};
    } catch(error) { return {status:'error',message:error.message,trace}; }
  }
  const final=values.get(path.steps[path.steps.length-1]?.target);
  return {status:final?'solved':'blocked',result:final?.value,trace,values};
}
