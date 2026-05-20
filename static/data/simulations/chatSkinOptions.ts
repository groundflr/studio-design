import { ChatSkin } from '~/types/Simulation'

/**
 * Maps ChatSkin to the corresponding string.
 * Eg: `chatSkinOptions[ChatSkin.Google]` returns `'Google'`
 */
export const chatSkinOptions: Record<ChatSkin, string> = {
  [ChatSkin.Google]: 'Google',
  [ChatSkin.Slack]: 'Slack',
}
