import { VARIABLES, createVariableIndex } from '../../data/variables/registry.js';
import { UNITS, createUnitIndex } from '../../data/units/registry.js';

const numberPattern = /(-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)\s*([A-Za-z²³°/·]+)?/gi;
const normalize = text => text.toLowerCase().replace(/[Δ∆]/g,'delta').replace(/\s+/g,' ').trim();

export function detectKeywords(text, equations=[]) {
  const source=normalize(text); const hits=[];
  for(const eq of equations){for(const keyword of eq.keywords||[]){if(source.includes(normalize(keyword)))hits.push({equationId:eq.id,keyword});}}
  return hits;
}

export function detectVariables(text, variables=VARIABLES) {
  const source=normalize(text); const index=createVariableIndex(variables); const found=new Map();
  for(const variable of variables){
    const aliases=[variable.id,variable.symbol,variable.name,...(variable.aliases||[])].filter(Boolean);
    for(const alias of aliases){
      const token=normalize(alias); if(!token)continue;
      if(source.includes(token)){if(!found.has(variable.id))found.set(variable.id,{variableId:variable.id,matches:[]});found.get(variable.id).matches.push(alias);}
    }
  }
  return [...found.values()];
}

export function detectUnits(text, units=UNITS) {
  const source=normalize(text); const index=createUnitIndex(units); const results=[];
  for(const match of source.matchAll(numberPattern)){
    const value=Number(match[1]); const raw=match[2]; if(!Number.isFinite(value)||!raw)continue;
    const unit=index.bySymbol.get(raw)||index.byId.get(raw);
    if(unit)results.push({value,unitId:unit.id,symbol:unit.symbol,index:match.index});
  }
  return results;
}

export function detectRequestedTarget(text, variables=VARIABLES) {
  const source=normalize(text); const cues=['find','calculate','determine','what is','solve for','how fast','how long','how far','acceleration','force'];
  const mentions=detectVariables(text,variables);
  const cuePresent=cues.some(c=>source.includes(c));
  if(!cuePresent||!mentions.length)return null;
  const questionPart=source.split(/[?.!]/).filter(Boolean).at(-1)||source;
  const likely=mentions.find(m=>questionPart.includes(normalize(m.variableId)))||mentions.at(-1);
  return likely?.variableId||null;
}

export function classifyDomains(text,equations=[]) {
  const hits=detectKeywords(text,equations); const scores=new Map();
  for(const hit of hits){const eq=equations.find(e=>e.id===hit.equationId);if(eq)scores.set(eq.domain,(scores.get(eq.domain)||0)+1);}
  return [...scores.entries()].map(([domain,score])=>({domain,score})).sort((a,b)=>b.score-a.score||a.domain.localeCompare(b.domain));
}

export function detectAmbiguities({text,variables,units}) {
  const warnings=[]; const source=normalize(text);
  if(!source)warnings.push('No problem text was provided.');
  if(/\b(speed|velocity)\b/.test(source))warnings.push('Speed and velocity may require different treatment; check whether direction matters.');
  if(/\b(distance|displacement)\b/.test(source))warnings.push('Distance and displacement are not always interchangeable.');
  if(/\bweight\b/.test(source))warnings.push('“Weight” may mean gravitational force, not mass.');
  if((variables||[]).length===0)warnings.push('No known variable names were detected.');
  if((units||[]).length===0&&/\d/.test(source))warnings.push('Numbers were detected without recognized units.');
  return warnings;
}

export function parseProblem(text,{variables=VARIABLES,units=UNITS,equations=[]}={}) {
  const detectedVariables=detectVariables(text,variables);
  const detectedUnits=detectUnits(text,units);
  const keywordHits=detectKeywords(text,equations);
  const domains=classifyDomains(text,equations);
  const target=detectRequestedTarget(text,variables);
  return Object.freeze({text,detectedVariables,detectedUnits,keywordHits,domains,target,ambiguities:detectAmbiguities({text,variables:detectedVariables,units:detectedUnits})});
}
