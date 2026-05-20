import { SimulationType } from '~/types/Simulation'

/**
 * Maps SimulationType to the corresponding string.
 * Eg: `simulationTypeOptions[SimulationType.chatConversation]` returns `'Chat conversation'`
 */
export const simulationTypeOptions: Record<SimulationType, string> = {
  [SimulationType.aiConversation]: 'AI conversation',
  [SimulationType.chatConversation]: 'Chat conversation',
  [SimulationType.emailCreate]: 'Email create and send',
  [SimulationType.emailReceive]: 'Email receive and reply',
  [SimulationType.voiceCall]: 'Voice call',
}

/**
 * Maps SimulationType to the corresponding icon.
 * Eg: `simulationTypeIcons[SimulationType.emailCreate]` returns `'mdi-format-list-numbered'`
 */
export const simulationTypeIcons: Record<SimulationType, string> = {
  [SimulationType.aiConversation]: 'fa-regular fa-cube',
  [SimulationType.emailCreate]: 'fa-regular fa-envelope',
  [SimulationType.emailReceive]: 'fa-regular fa-envelope',
  [SimulationType.chatConversation]: 'fa-regular fa-comment-dots',
  [SimulationType.voiceCall]: 'fa-regular fa-phone',
}
