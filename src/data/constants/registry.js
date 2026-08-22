export const CONSTANTS = Object.freeze([
  {id:'g0',symbol:'g',name:'standard gravitational acceleration',value:9.80665,unit:'m/s²',dimensions:{L:1,T:-2},purpose:'Reference gravitational acceleration near Earth.',exact:false},
  {id:'c',symbol:'c',name:'speed of light in vacuum',value:299792458,unit:'m/s',dimensions:{L:1,T:-1},purpose:'Universal speed constant used in electromagnetism and relativity.',exact:true},
  {id:'G',symbol:'G',name:'gravitational constant',value:6.67430e-11,unit:'m³/(kg·s²)',dimensions:{M:-1,L:3,T:-2},purpose:'Connects masses and gravitational force.',exact:false},
  {id:'k_e',symbol:'k_e',name:'Coulomb constant',value:8.9875517923e9,unit:'N·m²/C²',dimensions:{M:1,L:3,T:-4,I:-2},purpose:'Connects electric charges and electrostatic force.',exact:false}
]);

export function createConstantIndex(constants = CONSTANTS) {
  return Object.freeze(new Map(constants.map(constant => [constant.id, constant])));
}
