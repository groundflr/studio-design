import { ColorOption } from '~/types/Colors'

/**
 * Maps ColorOption to the corresponding string.
 * Eg: `colorOptionHexes[ColorOption.Pink]` returns `'#db2777'`
 */
export const colorOptionHexes: Record<ColorOption, string> = {
  [ColorOption.Pink]: '#db2777',
  [ColorOption.Red]: '#dc2626',
  [ColorOption.Orange]: '#ea580c',
  [ColorOption.Yellow]: '#ca8a04',
  [ColorOption.Green]: '#16a34a',
  [ColorOption.Teal]: '#0d9488',
  [ColorOption.Sky]: '#0284c7',
  [ColorOption.Indigo]: '#4f46e5',
  [ColorOption.Purple]: '#9333ea',
  [ColorOption.Primary]: '#4f46e5',
  [ColorOption.Error]: '#D92D20',
  [ColorOption.Success]: '#039855',
  [ColorOption.Grey]: '#374151',
}
