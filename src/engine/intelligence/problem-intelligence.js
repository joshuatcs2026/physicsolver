// Phase 5 (v1.2): problem understanding and equation-selection intelligence.
const KEYWORDS={
  kinematics:['velocity','speed','acceleration','displacement','distance','motion','time'],
  dynamics:['force','friction','normal','mass','newton','tension'],
  energy:['energy','work','power','kinetic','potential','joule'],
  momentum:['momentum','impulse','collision'],
  circular:['centripetal','radius','angular','circular','rotation'],
  fluids:['pressure','density','buoyant','fluid','continuity','pascal'],
  thermal:['heat','temperature','thermal','specific heat','latent','calorimetry'],
  waves:['wave','wavelength','frequency','period','sound'],
  electricity:['voltage','current','resistance','circuit','charge','electric'],
  magnetism:['magnetic','induction','flux','field'],
  optics:['lens','mirror','focal','image','refraction','optics'],
  quantum:['photon','quantum','de broglie','wavelength'],
  chemistry:['mole','molarity','molar','stoichiometry','gas','ph','enthalpy','dilution','concentration']
};
const DIAGRAM_HINTS=['diagram','figure','shown','incline','ramp','circuit','ray','lens','mirror','vector','projectile','river','pulley','spring','collision'];
export function detectDomains(text=''){
  const s=String(text).toLowerCase();
  return Object.entries(KEYWORDS).map(([domain,words])=>({domain,score:words.reduce((n,w)=>n+(s.includes(w)?1:0),0),matches:words.filter(w=>s.includes(w))})).filter(x=>x.score).sort((a,b)=>b.score-a.score);
}
export function detectProblemFeatures(text=''){
  const s=String(text).toLowerCase();
  return {domains:detectDomains(s),requiresDiagram:DIAGRAM_HINTS.some(x=>s.includes(x)),hasQuestionMark:s.includes('?'),mentionsUnknowns:/find|calculate|determine|solve|what is|how much|how fast|how far/.test(s)};
}
export function extractQuantities(text=''){
  const out=[];const re=/([a-zA-Z_Δθλμρ][a-zA-Z0-9_Δθλμρ]*)\s*(?:=|is|equals)\s*(-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)\s*([a-zA-ZΩμ°·/^0-9-]+)?/gi;let m;while((m=re.exec(String(text))))out.push({name:m[1],value:Number(m[2]),unit:m[3]||null});return out;}
export function countUnknowns(equation,knowns={}){const vars=equation?.variables||[];return {total:vars.length,known:vars.filter(v=>Number.isFinite(Number(knowns[v]))).length,unknown:vars.filter(v=>!Number.isFinite(Number(knowns[v]))),unknownCount:vars.filter(v=>!Number.isFinite(Number(knowns[v]))).length};}
export function rankEquations(equations,knowns={},target=null,features={}){return equations.map(eq=>{const c=countUnknowns(eq,knowns);const domainHit=features.domains?.some(d=>eq.domain===d.domain)||false;let score=100-c.unknownCount*30+(domainHit?15:0);if(target&&eq.variables?.includes(target))score+=25;if(c.unknownCount===1)score+=30;return {...eq,solverScore:score,unknownCount:c.unknownCount,unknownVariables:c.unknown};}).sort((a,b)=>b.solverScore-a.solverScore);}
export function principleMode(equations,knowns={},target=null){return rankEquations(equations,knowns,target).filter(e=>e.unknownCount<=2).slice(0,12).map(e=>({equationId:e.id,principle:e.principle||e.name||e.expression,why:e.description||`Uses ${e.variables.join(', ')}.`}));}
