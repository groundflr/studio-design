import { EmailSkin } from '~/types/Simulation'

/**
 * Maps EmailSkin to the corresponding string.
 * Eg: `emailSkinOptions[EmailSkin.Google]` returns `'Google'`
 */
export const emailSkinOptions: Record<EmailSkin, string> = {
  [EmailSkin.Google]: 'Google',
  [EmailSkin.Microsoft]: 'Microsoft',
}
