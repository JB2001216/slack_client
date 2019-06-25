export enum Colors {
  primary = 'primary',
  secondary = 'secondary',

  primaryBlack = 'primary-black',
  boundaryWhite = 'boundary-white',
  boundaryBlack = 'boundary-black',

  gray = 'gray',
  white = 'white',
  whiteGray = 'white-gray',

  lightGray = 'light-gray',
  purple = 'purple',
  violet = 'violet',
  red = 'red',
  orange = 'orange',
  yellow = 'yellow',
  lightGreen = 'light-green',
  heavyGreen = 'heavy-green',
  lazyBlue = 'lazy-blue',
  blue = 'blue',
  sky = 'sky',
}

export function getColorClassName(type: 'text' | 'bg' | 'fill', color: Colors) {
  return `${color}--${type}`;
}
