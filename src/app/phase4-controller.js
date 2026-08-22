import { EQUATIONS } from '../data/equations/registry.js';
import { VARIABLES } from '../data/variables/registry.js';
import { UNITS } from '../data/units/registry.js';
import { parseProblem } from '../engine/parser/problem-parser.js';
import { inferKnownsFromProblem, mergeKnowns } from '../engine/parser/quantity-extractor.js';
import { classifyProblem } from '../engine/parser/problem-classifier.js';
import { analyzeProblem } from './solver-controller.js';
export function analyzeProblemText({text,userKnowns={},target=null}){const options={variables:VARIABLES,units:UNITS,equations:EQUATIONS},parsed=parseProblem(text,options),extracted=inferKnownsFromProblem(text,options),classification=classifyProblem(text,options),knowns=mergeKnowns(extracted.knowns,userKnowns),selectedTarget=target||parsed.target,solver=selectedTarget?analyzeProblem({knowns,target:selectedTarget,text,domains:parsed.domains.map(x=>x.domain)}):null;return{parsed,classification,extraction:{confidence:extracted.confidence,knowns:extracted.knowns,unmatched:extracted.unmatched},selectedTarget,knowns,solver,notice:`Heuristic extraction confidence: ${extracted.confidence}. Confirm detected values before relying on them.`};}
