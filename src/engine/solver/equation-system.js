import { EQUATIONS } from '../../data/equations/registry.js';
const finite=x=>Number.isFinite(x);
const d=(a,b)=>{if(!finite(a)||!finite(b)||Math.abs(b)<1e-15)throw new Error('Invalid or zero denominator');return a/b};
const s=x=>{if(x<0)throw new Error('Negative square-root argument');return Math.sqrt(x)};
const FORMULAS={
'mechanics.speed':{speed:g=>d(g.distance,g.time),distance:g=>g.speed*g.time,time:g=>d(g.distance,g.speed)},
'mechanics.relative_velocity':{relative_velocity:g=>g.velocity_a-g.velocity_b,velocity_a:g=>g.relative_velocity+g.velocity_b,velocity_b:g=>g.velocity_a-g.relative_velocity},
'mechanics.circular_speed':{tangential_speed:g=>g.radius*g.angular_velocity,radius:g=>d(g.tangential_speed,g.angular_velocity),angular_velocity:g=>d(g.tangential_speed,g.radius)},
'mechanics.centripetal_acceleration':{centripetal_acceleration:g=>d(g.tangential_speed**2,g.radius),radius:g=>d(g.tangential_speed**2,g.centripetal_acceleration),tangential_speed:g=>s(g.centripetal_acceleration*g.radius)},
'mechanics.centripetal_force':{centripetal_force:g=>d(g.mass*g.tangential_speed**2,g.radius),mass:g=>d(g.centripetal_force*g.radius,g.tangential_speed**2),radius:g=>d(g.mass*g.tangential_speed**2,g.centripetal_force)},
'mechanics.angular_velocity':{angular_velocity:g=>d(g.angular_displacement,g.time),angular_displacement:g=>g.angular_velocity*g.time,time:g=>d(g.angular_displacement,g.angular_velocity)},
'mechanics.torque':{torque:g=>g.radius*g.force_applied*Math.sin(g.angle)},
'fluids.density':{density:g=>d(g.mass,g.volume),mass:g=>g.density*g.volume,volume:g=>d(g.mass,g.density)},
'fluids.pressure':{pressure:g=>d(g.force,g.area),force:g=>g.pressure*g.area,area:g=>d(g.force,g.pressure)},
'fluids.flow':{volume_flow_rate:g=>g.area*g.fluid_speed,area:g=>d(g.volume_flow_rate,g.fluid_speed),fluid_speed:g=>d(g.volume_flow_rate,g.area)},
'waves.angular_frequency':{angular_frequency:g=>2*Math.PI*g.frequency,frequency:g=>d(g.angular_frequency,2*Math.PI)},
'waves.intensity':{intensity:g=>d(g.power,g.area),power:g=>g.intensity*g.area,area:g=>d(g.power,g.intensity)},
'electric.current':{current:g=>d(g.charge,g.time),charge:g=>g.current*g.time,time:g=>d(g.charge,g.current)},
'electric.charge_particles':{charge:g=>g.particle_count*g.elementary_charge,particle_count:g=>d(g.charge,g.elementary_charge)},
'electric.field':{electric_field:g=>d(g.electric_force,g.charge),electric_force:g=>g.electric_field*g.charge,charge:g=>d(g.electric_force,g.electric_field)},
'circuits.ohm':{voltage:g=>g.current*g.resistance,current:g=>d(g.voltage,g.resistance),resistance:g=>d(g.voltage,g.current)},
'circuits.power':{electric_power:g=>g.voltage*g.current,voltage:g=>d(g.electric_power,g.current),current:g=>d(g.electric_power,g.voltage)},
'circuits.energy':{electric_energy:g=>g.electric_power*g.time,electric_power:g=>d(g.electric_energy,g.time),time:g=>d(g.electric_energy,g.electric_power)},
'capacitance.charge':{capacitor_charge:g=>g.capacitance*g.voltage,capacitance:g=>d(g.capacitor_charge,g.voltage),voltage:g=>d(g.capacitor_charge,g.capacitance)},
'modern.photon':{photon_energy:g=>g.frequency*6.62607015e-34,frequency:g=>d(g.photon_energy,6.62607015e-34)},
'chem.moles_mass':{amount:g=>d(g.mass,g.molar_mass),mass:g=>g.amount*g.molar_mass,molar_mass:g=>d(g.mass,g.amount)},
'chem.particles':{particle_count:g=>g.amount*6.02214076e23,amount:g=>d(g.particle_count,6.02214076e23)},
'chem.molarity':{concentration:g=>d(g.amount,g.solution_volume),amount:g=>g.concentration*g.solution_volume,solution_volume:g=>d(g.amount,g.concentration)},
'chem.dilution':{concentration_final:g=>d(g.concentration_initial*g.volume_initial,g.volume_final),volume_final:g=>d(g.concentration_initial*g.volume_initial,g.concentration_final),concentration_initial:g=>d(g.concentration_final*g.volume_final,g.volume_initial),volume_initial:g=>d(g.concentration_final*g.volume_final,g.concentration_initial)},
'chem.mass_percent':{mass_percent:g=>100*d(g.solute_mass,g.solution_mass),solute_mass:g=>g.mass_percent*g.solution_mass/100,solution_mass:g=>100*d(g.solute_mass,g.mass_percent)},
'chem.gas_density':{density:g=>d(g.pressure*g.molar_mass,8.314462618*g.temperature),molar_mass:g=>d(g.density*8.314462618*g.temperature,g.pressure)},
'chem.partial_pressure':{partial_pressure:g=>g.mole_fraction*g.total_pressure,mole_fraction:g=>d(g.partial_pressure,g.total_pressure),total_pressure:g=>d(g.partial_pressure,g.mole_fraction)},
'chem.ph':{ph:g=>-Math.log10(g.hydrogen_concentration),hydrogen_concentration:g=>10**(-g.ph)},
'chem.poh':{poh:g=>-Math.log10(g.hydroxide_concentration),hydroxide_concentration:g=>10**(-g.poh)},
'chem.water':{ph:g=>14-g.poh,poh:g=>14-g.ph}
};
function normalize(knowns){const out=new Map();for(const [key,value]of Object.entries(knowns||{})){const n=typeof value==='object'?Number(value.value):Number(value);if(finite(n))out.set(key,n)}return out}
export function solveEquation(equationId,target,knowns){const formula=FORMULAS[equationId]?.[target];if(!formula)throw new Error(`No trusted evaluator for ${equationId} → ${target}`);const g=Object.fromEntries(normalize(knowns));const equation=EQUATIONS.find(e=>e.id===equationId);if(!equation)throw new Error(`Unknown equation: ${equationId}`);const required=equation.targetMap[target]||[];const missing=required.filter(v=>!(v in g));if(missing.length)throw new Error(`Missing values: ${missing.join(', ')}`);const value=formula(g);if(!finite(value))throw new Error('Result is not finite');return{equationId,target,value,required};}
export function solveKnownSystem({knowns,target=null,maxPasses=12,equations=EQUATIONS}={}){const values=normalize(knowns);const steps=[];for(let pass=0;pass<maxPasses;pass++){let changed=false;for(const equation of equations){const formulas=FORMULAS[equation.id];if(!formulas)continue;for(const [candidate,fn]of Object.entries(formulas)){if(values.has(candidate))continue;const required=equation.targetMap[candidate]||[];if(required.length===0||!required.every(v=>values.has(v)))continue;try{const g=Object.fromEntries(values);const value=fn(g);if(finite(value)){values.set(candidate,value);steps.push({pass,equationId:equation.id,target:candidate,value,required});changed=true;if(target===candidate)return{values:Object.fromEntries(values),steps,targetReached:true};}}catch{}}
}if(!changed)break;}return{values:Object.fromEntries(values),steps,targetReached:target?values.has(target):true};}
export function listSupportedEvaluators(){return Object.keys(FORMULAS)}
