import { runPhysicsTool } from '../engine/tools/physics-tools.js';
const $=id=>document.getElementById(id);
function num(id){const n=Number($(id).value);if(!Number.isFinite(n))throw new Error(`Enter a valid number for ${id}.`);return n;}
function show(id,value){$(id).textContent=typeof value==='object'?Object.entries(value).map(([k,v])=>`${k}: ${Number.isFinite(v)?Number(v.toFixed(6)):v}`).join(' | '):String(value);}
function bind(button,output,fn){$(button).onclick=()=>{try{show(output,fn());}catch(e){show(output,e.message);}}}
document.addEventListener('DOMContentLoaded',()=>{bind('tool-vector-run','tool-vector-output',()=>runPhysicsTool('vector',{magnitude:num('tool-vector-mag'),angleDeg:num('tool-vector-angle')}));bind('tool-resultant-run','tool-resultant-output',()=>runPhysicsTool('resultant',{x:num('tool-resultant-x'),y:num('tool-resultant-y')}));bind('tool-coordinate-run','tool-coordinate-output',()=>runPhysicsTool('distance',{x1:num('tool-x1'),y1:num('tool-y1'),x2:num('tool-x2'),y2:num('tool-y2')}));bind('tool-projectile-run','tool-projectile-output',()=>runPhysicsTool('projectile',{u:num('tool-projectile-u'),angleDeg:num('tool-projectile-angle')}));});
