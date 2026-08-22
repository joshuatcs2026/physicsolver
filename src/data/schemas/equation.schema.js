// Planned equation contract. Keep data declarative; solver logic belongs in src/engine.
export const EquationSchema = Object.freeze({
  required: ['id', 'name', 'domain', 'expression', 'variables', 'solveFor'],
  optional: ['keywords', 'assumptions', 'dimensions', 'explanations', 'version']
});
