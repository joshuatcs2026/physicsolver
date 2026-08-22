export const REARRANGEMENTS = Object.freeze({
  'kinematics.velocity_time': {
    velocity_final:'vf = vi + a·t', velocity_initial:'vi = vf - a·t', acceleration:'a = (vf - vi)/t', time:'t = (vf - vi)/a'
  },
  'kinematics.displacement_velocity': {
    displacement:'Δx = ((vi + vf)/2)·t', velocity_initial:'vi = 2Δx/t - vf', velocity_final:'vf = 2Δx/t - vi', time:'t = 2Δx/(vi + vf)'
  },
  'dynamics.newton_second': { force:'F = m·a', mass:'m = F/a', acceleration:'a = F/m' },
  'energy.kinetic': { energy:'KE = ½mv²', mass:'m = 2KE/v²', velocity_final:'v = √(2KE/m)' },
  'energy.gravitational': { energy:'Ug = mgh', mass:'m = Ug/(gh)', height:'h = Ug/(mg)' },
  'momentum.linear': { momentum:'p = mv', mass:'m = p/v', velocity_final:'v = p/m' }
});

export function getRearrangement(equationId, target) {
  return REARRANGEMENTS[equationId]?.[target] || null;
}
