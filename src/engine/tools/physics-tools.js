export const physicsTools={
  vector({magnitude,angleDeg}){const a=angleDeg*Math.PI/180;return{x:magnitude*Math.cos(a),y:magnitude*Math.sin(a)};},
  resultant({x=0,y=0}){return{magnitude:Math.hypot(x,y),angleDeg:Math.atan2(y,x)*180/Math.PI};},
  distance({x1,y1,x2,y2}){return Math.hypot(x2-x1,y2-y1);},
  displacement({x1,y1,x2,y2}){return{x:x2-x1,y:y2-y1,magnitude:Math.hypot(x2-x1,y2-y1)};},
  midpoint({x1,y1,x2,y2}){return{x:(x1+x2)/2,y:(y1+y2)/2};},
  slope({x1,y1,x2,y2}){if(x2===x1)return Infinity;return(y2-y1)/(x2-x1);},
  kineticEnergy({m,v}){return .5*m*v*v;},
  momentum({m,v}){return m*v;},
  gravitationalPotentialEnergy({m,g=9.80665,h}){return m*g*h;},
  projectile({u,angleDeg,g=9.80665}){const a=angleDeg*Math.PI/180;return{vx:u*Math.cos(a),vy:u*Math.sin(a),time:2*u*Math.sin(a)/g,range:u*u*Math.sin(2*a)/g,maxHeight:u*u*Math.sin(a)**2/(2*g)};}
};

export function runPhysicsTool(name,input){if(!physicsTools[name])throw new Error(`Unknown physics tool: ${name}`);return physicsTools[name](input||{});}
