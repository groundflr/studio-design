import { SimulationBackgroundOption } from '~/types/Simulation'

/**
 * Maps SimulationBackgroundOption to the corresponding string.
 * Eg: `backgroundOptions[SimulationBackgroundOption.None]` returns `'No Background'`
 */
export const backgroundOptions: Record<SimulationBackgroundOption, string> = {
  [SimulationBackgroundOption.None]: 'No Background',
  [SimulationBackgroundOption.Flower]: 'Flower',
  [SimulationBackgroundOption.Galaxy]: 'Galaxy',
  [SimulationBackgroundOption.Gradients]: 'Gradients',
  [SimulationBackgroundOption.Mountain]: 'Mountain',
  [SimulationBackgroundOption.Rays]: 'Rays',
  [SimulationBackgroundOption.Waves]: 'Waves',
}
