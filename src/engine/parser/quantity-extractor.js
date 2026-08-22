import { parseProblem } from './problem-parser.js';

export function inferKnownsFromProblem(text, options={}) {
  const parsed=parseProblem(text,options); const assignments={}; const unmatched=[];
  const candidates=parsed.detectedVariables.map(x=>x.variableId);
  for(let i=0;i<parsed.detectedUnits.length;i++){
    const quantity=parsed.detectedUnits[i]; const variableId=candidates[i];
    if(variableId&&!assignments[variableId])assignments[variableId]={value:quantity.value,unit:quantity.symbol,source:'heuristic-order'};
    else unmatched.push(quantity);
  }
  return {knowns:assignments,unmatched,confidence:Object.keys(assignments).length&&parsed.detectedUnits.length?'low':'none',parsed};
}

export function mergeKnowns(extracted={}, userProvided={}) {
  return {...extracted,...userProvided};
}
