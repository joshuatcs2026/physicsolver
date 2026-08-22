export const EXTRA_VARIABLES=Object.freeze([
{id:'density',symbol:'ρ',name:'density',meaning:'Mass per unit volume.',purpose:'Connects mass and volume.',dimensions:{M:1,L:-3},commonUnits:['kg/m^3'],aliases:['rho','mass density']},
{id:'volume',symbol:'V',name:'volume',meaning:'Amount of three-dimensional space occupied.',purpose:'Connects density to mass.',dimensions:{L:3},commonUnits:['m^3','L'],aliases:['capacity']},
{id:'pressure',symbol:'p',name:'pressure',meaning:'Force distributed over an area.',purpose:'Used in pressure and fluid calculations.',dimensions:{M:1,L:-1,T:-2},commonUnits:['Pa'],aliases:['fluid pressure']},
{id:'area',symbol:'A',name:'area',meaning:'Size of a two-dimensional surface.',purpose:'Connects pressure and force.',dimensions:{L:2},commonUnits:['m^2'],aliases:['surface area']},
{id:'charge',symbol:'q',name:'electric charge',meaning:'Quantity of electric charge.',purpose:'Used in circuits.',dimensions:{I:1,T:1},commonUnits:['C'],aliases:['electric charge']},
{id:'current',symbol:'I',name:'electric current',meaning:'Rate of charge flow.',purpose:'Used in circuit relationships.',dimensions:{I:1},commonUnits:['A'],aliases:['amperage']},
{id:'voltage',symbol:'V',name:'voltage',meaning:'Electric potential difference.',purpose:'Drives current through resistance.',dimensions:{M:1,L:2,T:-3,I:-1},commonUnits:['V'],aliases:['potential difference']},
{id:'resistance',symbol:'R',name:'electrical resistance',meaning:'Opposition to electric current.',purpose:'Connects voltage and current through Ohm law.',dimensions:{M:1,L:2,T:-3,I:-2},commonUnits:['ohm'],aliases:['resistor resistance','Ω']},
{id:'heat',symbol:'Q',name:'thermal energy transfer',meaning:'Energy transferred because of temperature difference.',purpose:'Used with mass, specific heat, and temperature change.',dimensions:{M:1,L:2,T:-2},commonUnits:['J'],aliases:['thermal energy']},
{id:'specific_heat',symbol:'c',name:'specific heat capacity',meaning:'Energy per mass per temperature change.',purpose:'Connects heat transfer to mass and temperature change.',dimensions:{L:2,T:-2,'Θ':-1},commonUnits:['J/(kg*K)'],aliases:['heat capacity']},
{id:'temperature_change',symbol:'ΔT',name:'temperature change',meaning:'Difference between final and initial temperature.',purpose:'Used in heating and cooling calculations.',dimensions:{'Θ':1},commonUnits:['K'],aliases:['change in temperature']},
{id:'radius',symbol:'r',name:'radius',meaning:'Distance from a center or axis.',purpose:'Used in circular motion.',dimensions:{L:1},commonUnits:['m'],aliases:['orbital radius']},
{id:'centripetal_acceleration',symbol:'a_c',name:'centripetal acceleration',meaning:'Acceleration toward the center of circular motion.',purpose:'Connects speed and radius.',dimensions:{L:1,T:-2},commonUnits:['m/s^2'],aliases:['radial acceleration']},
{id:'angular_speed',symbol:'ω',name:'angular speed',meaning:'Rate of angular position change.',purpose:'Connects rotational speed to period and tangential speed.',dimensions:{T:-1},commonUnits:['rad/s'],aliases:['omega','angular velocity']},
{id:'gravitational_force',symbol:'F_g',name:'weight',meaning:'Gravitational force on an object near Earth.',purpose:'Connects mass to gravitational field strength.',dimensions:{M:1,L:1,T:-2},commonUnits:['N'],aliases:['weight','gravity force']}
]);
