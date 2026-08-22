const finite=(n,name)=>{n=Number(n);if(!Number.isFinite(n))throw new Error(`${name} must be finite`);return n;};
export function components({magnitude,angle=0,reference='x',signY=1}){const r=finite(magnitude,'magnitude'),rad=finite(angle,'angle')*Math.PI/180;if(reference==='x')return{x:r*Math.cos(rad),y:signY*r*Math.sin(rad)};if(reference==='y')return{x:signY*r*Math.sin(rad),y:r*Math.cos(rad)};throw new Error(`Unsupported reference axis: ${reference}`);}
export function magnitude({x=0,y=0}){return Math.hypot(finite(x,'x'),finite(y,'y'));}
export function direction({x=0,y=0}){x=finite(x,'x');y=finite(y,'y');if(x===0&&y===0)return{angle:null,warning:'Zero vector has no unique direction.'};let a=Math.atan2(y,x)*180/Math.PI;if(a<0)a+=360;return{angle:a,quadrant:x>=0?(y>=0?'I':'IV'):(y>=0?'II':'III')};}
export function add(vectors=[]){return vectors.reduce((s,v)=>({x:s.x+finite(v.x||0,'x'),y:s.y+finite(v.y||0,'y')}),{x:0,y:0});}
export function resultant(vectors=[]){const sum=add(vectors);return{...sum,magnitude:magnitude(sum),direction:direction(sum)};}
export function dot(a,b){return finite(a.x,'ax')*finite(b.x,'bx')+finite(a.y,'ay')*finite(b.y,'by');}
export function perpendicular(a,b,tolerance=1e-9){return Math.abs(dot(a,b))<=tolerance;}
