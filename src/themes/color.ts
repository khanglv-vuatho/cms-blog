import colorsTailwind from 'tailwindcss/colors'
import { DefaultColors } from 'tailwindcss/types/generated/colors'

type TColorsConfig = {
  'primary-blue': '#0d308c'
  'primary-blue-2': '#F1F6FF'
  'primary-blue-3': '#327EEE'
  'base-black': '#5A9DFF'
  'base-black-1': '#282828'
  'base-gray': '#F8F8F8'
  'base-gray-2': '#E1E1E1'
  'base-drak-gray': '#969696'
  'primary-red': '#FF4343'
  'primary-green': '#17D641'
  'primary-orange': '#FF8F34'
  'primary-yellow': '#FCB813'
  danger: '#FF4343'
  success: '#17D641'
} & DefaultColors

export const colorsConfig: TColorsConfig = {
  ...colorsTailwind,
  'primary-blue': '#0d308c',
  'primary-blue-2': '#F1F6FF',
  'primary-blue-3': '#327EEE',
  'base-black': '#5A9DFF',
  'base-black-1': '#282828',
  'base-gray': '#F8F8F8',
  'base-gray-2': '#E1E1E1',
  'base-drak-gray': '#969696',
  'primary-red': '#FF4343',
  'primary-green': '#17D641',
  'primary-orange': '#FF8F34',
  'primary-yellow': '#FCB813',
  danger: '#FF4343',
  success: '#17D641',
}

export const backgroudImageConfig = {}
