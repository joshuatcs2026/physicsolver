import { EQUATIONS } from '../data/equations/registry.js';
import { VARIABLES } from '../data/variables/registry.js';
import { UNITS } from '../data/units/registry.js';
import { parseProblem } from '../engine/parser/problem-parser.js';
import { inferKnownsFromProblem, mergeKnowns } from '../engine/parser/quantity-extractor.js';
import { classifyProblem } from '../engine/parser/problem-classifier.js';
import { analyzeDirectProblem } from './phase2-controller.js';

export function analyzeProblemText({text,userKnowns={},target=null}) {
  const options={variables:VARIABLES,units:UNITS,equations:EQUATIONS};
  const parsed=parseProblem(text,options);
  const extracted=inferKnownsFromProblem(text,options);
  const classification=classifyProblem(text,options);
  const knowns=mergeKnowns(extracted.knowns,userKnowns);
  const selectedTarget=target||parsed.target;
  const solver=selectedTarget?analyzeDirectProblem({knowns,target:selectedTarget,text}):null;
  return {parsed,classification,extraction:{confidence:extracted.confidence,knowns:extracted.knowns,unmatched:extracted.unmatched},selectedTarget,knowns,solver,notice:'Heuristic extraction is intentionally low-confidence. Confirm detected values before relying on them.'};
}
