export const CONSTANTS={
 g0:{name:'Standard gravitational acceleration',value:9.80665,unit:'m/s^2',symbol:'g'},
 G:{name:'Newtonian gravitational constant',value:6.67430e-11,unit:'N m^2/kg^2',symbol:'G'},
 c:{name:'Speed of light in vacuum',value:299792458,unit:'m/s',symbol:'c'},
 h:{name:'Planck constant',value:6.62607015e-34,unit:'J s',symbol:'h'},
 hbar:{name:'Reduced Planck constant',value:1.054571817e-34,unit:'J s',symbol:'hbar'},
 e:{name:'Elementary charge magnitude',value:1.602176634e-19,unit:'C',symbol:'e'},
 me:{name:'Electron mass',value:9.1093837139e-31,unit:'kg',symbol:'m_e'},
 mp:{name:'Proton mass',value:1.67262192595e-27,unit:'kg',symbol:'m_p'},
 NA:{name:'Avogadro constant',value:6.02214076e23,unit:'1/mol',symbol:'N_A'},
 kB:{name:'Boltzmann constant',value:1.380649e-23,unit:'J/K',symbol:'k_B'},
 R:{name:'Molar gas constant',value:8.314462618,unit:'J/(mol K)',symbol:'R'},
 epsilon0:{name:'Vacuum permittivity',value:8.8541878128e-12,unit:'F/m',symbol:'epsilon_0'},
 mu0:{name:'Vacuum permeability',value:1.25663706127e-6,unit:'N/A^2',symbol:'mu_0'},
 ke:{name:'Coulomb constant',value:8.9875517923e9,unit:'N m^2/C^2',symbol:'k_e'},
 sigma:{name:'Stefan-Boltzmann constant',value:5.670374419e-8,unit:'W/(m^2 K^4)',symbol:'sigma'}
};
export const constantList=()=>Object.entries(CONSTANTS).map(([id,value])=>({id,...value}));
