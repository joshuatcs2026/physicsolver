// Small bounded cache for repeated UI planning. Keeps solver state out of the DOM and is safe to discard.
export function createPlanCache(limit=32){
 const map=new Map();
 const key=(equations,knowns,target,domain,maxDepth)=>JSON.stringify({e:equations.map(e=>e.id??e.expression),k:knowns,t:target,d:domain,m:maxDepth});
 return {get(e,k,t,d,m){const hit=map.get(key(e,k,t,d,m));if(hit){map.delete(key(e,k,t,d,m));map.set(key(e,k,t,d,m),hit)}return hit},set(e,k,t,d,m,value){const k0=key(e,k,t,d,m);map.set(k0,value);while(map.size>limit)map.delete(map.keys().next().value);return value},clear(){map.clear()},size(){return map.size}};
}
