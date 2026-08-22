const n=(x,label)=>{x=Number(x);if(!Number.isFinite(x))throw new Error(`${label} must be finite`);return x;};
export function displacement(a,b){const dx=n(b.x,'x2')-n(a.x,'x1'),dy=n(b.y,'y2')-n(a.y,'y1');return{dx,dy,distance:Math.hypot(dx,dy)};}
export function midpoint(a,b){return{x:(n(a.x,'x1')+n(b.x,'x2'))/2,y:(n(a.y,'y1')+n(b.y,'y2'))/2};}
export function slope(a,b){const dx=n(b.x,'x2')-n(a.x,'x1'),dy=n(b.y,'y2')-n(a.y,'y1');return dx===0?{value:null,vertical:true}:{value:dy/dx,vertical:false};}
export function lineFromPointSlope(point,m){m=n(m,'slope');const b=n(point.y,'y')-m*n(point.x,'x');return{m,b,expression:`y = ${m}x + ${b}`};}
export function coordinateClassification(points=[]){if(points.length<2)return{type:'insufficient'};const slopes=[];for(let i=1;i<points.length;i++)slopes.push(slope(points[i-1],points[i]));return{type:'path',segments:points.length-1,slopes};}
