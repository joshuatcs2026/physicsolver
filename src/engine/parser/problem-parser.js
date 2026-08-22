import { VARIABLES } from '../../data/variables/registry.js';
import { UNITS, createUnitIndex } from '../../data/units/registry.js';

const numberPattern=/(-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)\s*([A-Za-z²³°/·]+)?/gi;
const normalize=text=>String(text||'').toLowerCase().replace(/[Δ∆]/g,'delta').replace(/\s+/g,' ').trim();
const escapeRegex=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const containsToken=(source,token)=>{if(!token)return false;const escaped=escapeRegex(token);if(/[a-z0-9_]/i.test(token))return new RegExp(`(^|[^a-z0-9_])${escaped}(?=$|[^a-z0-9_])`,'i').test(source);return source.includes(token);};

export function detectKeywords(text,equations=[]){const source=normalize(text),hits=[];for(const eq of equations)for(const keyword of eq.keywords||[])if(containsToken(source,normalize(keyword)))hits.push({equationId:eq.id,keyword});return hits;}

export function detectVariables(text,variables=VARIABLES){const source=normalize(text),found=new Map();for(const variable of variables){const aliases=[variable.id,variable.symbol,variable.name,...(variable.aliases||[])].filter(Boolean);for(const alias of aliases){const token=normalize(alias);if(containsToken(source,token)){if(!found.has(variable.id))found.set(variable.id,{variableId:variable.id,matches:[]});found.get(variable.id).matches.push(alias);}}}return [...found.values()];}

export function detectUnits(text,units=UNITS){const source=normalize(text),index=createUnitIndex(units),results=[];for(const match of source.matchAll(numberPattern)){const value=Number(match[1]),raw=match[2];if(!Number.isFinite(value)||!raw)continue;const unit=index.bySymbol.get(raw)||index.byId.get(raw);if(unit)results.push({value,unitId:unit.id,symbol:unit.symbol,index:match.index});}return results;}

export function detectRequestedTarget(text,variables=VARIABLES){const source=normalize(text);const cues=['find','calculate','determine','what is','solve for','how fast','how long','how far'];const cueIndex=Math.max(...cues.map(c=>source.lastIndexOf(c)));if(cueIndex<0)return null;const questionPart=source.slice(cueIndex);const mentions=detectVariables(questionPart,variables);return mentions.at(-1)?.variableId||null;}

export function classifyDomains(text,equations=[]){const hits=detectKeywords(text,equations),scores=new Map();for(const hit of hits){const eq=equations.find(e=>e.id===hit.equationId);if(eq)scores.set(eq.domain,(scores.get(eq.domain)||0)+1);}return [...scores.entries()].map(([domain,score])=>({domain,score})).sort((a,b)=>b.score-a.score||a.domain.localeCompare(b.domain));}

export function detectAmbiguities({text,variables,units}){const warnings=[],source=normalize(text);if(!source)warnings.push('No problem text was provided.');if(/\b(speed|velocity)\b/.test(source))warnings.push('Speed and velocity may require different treatment; check whether direction matters.');if(/\b(distance|displacement)\b/.test(source))warnings.push('Distance and displacement are not always interchangeable.');if(/\bweight\b/.test(source))warnings.push('“Weight” may mean gravitational force, not mass.');if(!(variables||[]).length)warnings.push('No known variable names were detected.');if(!(units||[]).length&&/\d/.test(source))warnings.push('Numbers were detected without recognized units.');return warnings;}

export function parseProblem(text,{variables=VARIABLES,units=UNITS,equations=[]}={}){const detectedVariables=detectVariables(text,variables),detectedUnits=detectUnits(text,units),keywordHits=detectKeywords(text,equations),domains=classifyDomains(text,equations),target=detectRequestedTarget(text,variables);return Object.freeze({text,detectedVariables,detectedUnits,keywordHits,domains,target,ambiguities:detectAmbiguities({text,variables:detectedVariables,units:detectedUnits})});}
