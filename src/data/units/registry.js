export const DIMENSION_KEYS = Object.freeze(['M','L','T','I','Θ','N','J']);

export const UNITS = Object.freeze([
  {id:'m',symbol:'m',name:'meter',dimensions:{L:1},scale:1,offset:0},
  {id:'cm',symbol:'cm',name:'centimeter',dimensions:{L:1},scale:0.01,offset:0},
  {id:'km',symbol:'km',name:'kilometer',dimensions:{L:1},scale:1000,offset:0},
  {id:'s',symbol:'s',name:'second',dimensions:{T:1},scale:1,offset:0},
  {id:'min',symbol:'min',name:'minute',dimensions:{T:1},scale:60,offset:0},
  {id:'h',symbol:'h',name:'hour',dimensions:{T:1},scale:3600,offset:0},
  {id:'kg',symbol:'kg',name:'kilogram',dimensions:{M:1},scale:1,offset:0},
  {id:'g',symbol:'g',name:'gram',dimensions:{M:1},scale:0.001,offset:0},
  {id:'N',symbol:'N',name:'newton',dimensions:{M:1,L:1,T:-2},scale:1,offset:0},
  {id:'J',symbol:'J',name:'joule',dimensions:{M:1,L:2,T:-2},scale:1,offset:0},
  {id:'kJ',symbol:'kJ',name:'kilojoule',dimensions:{M:1,L:2,T:-2},scale:1000,offset:0},
  {id:'W',symbol:'W',name:'watt',dimensions:{M:1,L:2,T:-3},scale:1,offset:0},
  {id:'rad',symbol:'rad',name:'radian',dimensions:{},scale:1,offset:0},
  {id:'deg',symbol:'deg',name:'degree',dimensions:{},scale:Math.PI/180,offset:0}
]);

export function sameDimensions(a={}, b={}) {
  return DIMENSION_KEYS.every(key => (a[key] || 0) === (b[key] || 0));
}

export function createUnitIndex(units = UNITS) {
  const byId = new Map();
  const bySymbol = new Map();
  for (const unit of units) { byId.set(unit.id, unit); bySymbol.set(unit.symbol, unit); }
  return Object.freeze({byId, bySymbol});
}

export function convert(value, from, to, index = createUnitIndex()) {
  const source = index.byId.get(from) || index.bySymbol.get(from);
  const target = index.byId.get(to) || index.bySymbol.get(to);
  if (!source || !target) throw new Error('Unknown unit');
  if (!sameDimensions(source.dimensions, target.dimensions)) throw new Error('Incompatible dimensions');
  const base = (value + source.offset) * source.scale;
  return base / target.scale - target.offset;
}
