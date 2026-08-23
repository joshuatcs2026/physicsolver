export function validatePhase1Catalog(equations){
 const errors=[],ids=new Set();
 for(const equation of equations){
  if(!equation?.id||!equation.domain||!equation.name||!equation.expression)errors.push(`Incomplete equation: ${equation?.id||'<unknown>'}`);
  if(ids.has(equation.id))errors.push(`Duplicate id: ${equation.id}`); ids.add(equation.id);
  if(!Array.isArray(equation.variables)||equation.variables.length<2)errors.push(`Invalid variables: ${equation.id}`);
  if(!Array.isArray(equation.keywords))errors.push(`Invalid keywords: ${equation.id}`);
  if(!Array.isArray(equation.assumptions))errors.push(`Invalid assumptions: ${equation.id}`);
 }
 return {ok:errors.length===0,errors,count:equations.length,domains:[...new Set(equations.map(x=>x.domain))]};
}
