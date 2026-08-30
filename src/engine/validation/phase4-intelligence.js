// Phase 4.1: physics-aware validation helpers. Conservative by design.
const POSITIVE = new Set(['mass','time','distance','radius','density','volume','pressure','frequency','period','wavelength','temperature_kelvin','moles','molar_mass','resistance','capacitance','inductance','speed','speed_initial','speed_final','velocity_magnitude']);
export function validatePhysicalValue(variable,value,{allowNegative=false,min,max}={}){
  const n=Number(value);
  if(!Number.isFinite(n))return {valid:false,severity:'error',reason:'Result is not finite.'};
  if(min!==undefined&&n<min)return {valid:false,severity:'warning',reason:`Result is below configured minimum (${min}).`};
  if(max!==undefined&&n>max)return {valid:false,severity:'warning',reason:`Result exceeds configured maximum (${max}).`};
  if(!allowNegative&&POSITIVE.has(variable)&&n<0)return {valid:false,severity:'warning',reason:`${variable} is normally non-negative.`};
  return {valid:true,severity:'ok',reason:null};
}
export function validateCandidates(variable,solutions,options={}){
  return solutions.map(value=>({value,...validatePhysicalValue(variable,value,options)}));
}

// Rank without changing correctness: fewer assumptions and fewer missing prerequisites win.
export function rankSolutionCandidates(candidates){
  return [...candidates].sort((a,b)=>(b.valid?1:0)-(a.valid?1:0));
}
