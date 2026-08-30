const UNITS={m:[1,{L:1}],cm:[0.01,{L:1}],km:[1000,{L:1}],s:[1,{T:1}],min:[60,{T:1}],h:[3600,{T:1}],kg:[1,{M:1}],g:[0.001,{M:1}],N:[1,{M:1,L:1,T:-2}],J:[1,{M:1,L:2,T:-2}],W:[1,{M:1,L:2,T:-3}],Pa:[1,{M:1,L:-1,T:-2}],Hz:[1,{T:-1}],C:[1,{I:1,T:1}],V:[1,{M:1,L:2,T:-3,I:-1}],ohm:[1,{M:1,L:2,T:-3,I:-2}]};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function convertUnit(value,from,to){if(from===to)return Number(value);const a=UNITS[from],b=UNITS[to];if(!a||!b)throw new Error(`Unsupported unit: ${from} or ${to}`);if(!same(a[1],b[1]))throw new Error(`Incompatible dimensions: ${from} and ${to}`);return Number(value)*a[0]/b[0];}
export function compatibleUnits(a,b){return !!UNITS[a]&&!!UNITS[b]&&same(UNITS[a][1],UNITS[b][1]);}
export function unitDimensions(unit){return UNITS[unit]?.[1]||null;}
