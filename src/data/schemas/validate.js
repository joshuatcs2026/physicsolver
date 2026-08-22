export function validateVariable(variable) {
  const required = ['id','symbol','name','meaning','purpose','dimensions','commonUnits','aliases'];
  return required.filter(key => !(key in variable));
}

export function validateEquation(equation, variableIndex, constantIndex) {
  const errors = [];
  for (const key of ['id','name','domain','expression','variables','targetMap']) if (!(key in equation)) errors.push(`missing:${key}`);
  if (variableIndex) for (const id of equation.variables || []) if (!variableIndex.byId.has(id)) errors.push(`unknown-variable:${id}`);
  if (constantIndex) for (const id of equation.constants || []) if (!constantIndex.has(id)) errors.push(`unknown-constant:${id}`);
  for (const [target, dependencies] of Object.entries(equation.targetMap || {})) {
    if (!(equation.variables || []).includes(target)) errors.push(`invalid-target:${target}`);
    if (!Array.isArray(dependencies) || dependencies.includes(target)) errors.push(`invalid-dependencies:${target}`);
    for (const dependency of Array.isArray(dependencies)?dependencies:[]) if (!(equation.variables || []).includes(dependency)) errors.push(`unknown-dependency:${target}:${dependency}`);
  }
  return errors;
}

export function validateRegistry({variables, equations, constants}) {
  const errors = [];
  const ids = new Set();
  for (const variable of variables) { if (ids.has(variable.id)) errors.push(`duplicate-variable:${variable.id}`); ids.add(variable.id); errors.push(...validateVariable(variable)); }
  const variableIndex = {byId:new Map(variables.map(v=>[v.id,v]))};
  const constantIndex = new Map(constants.map(c=>[c.id,c]));
  const equationIds = new Set();
  for (const equation of equations) { if (equationIds.has(equation.id)) errors.push(`duplicate-equation:${equation.id}`); equationIds.add(equation.id); errors.push(...validateEquation(equation, variableIndex, constantIndex).map(error=>`${equation.id}:${error}`)); }
  return errors;
}
