export const toDistance = (metres = 0) => {
  if (metres < 0.01) {
    return '0m'
  } else if (metres < 1000) {
    return `${metres.toFixed(2)}m`
  } else if (metres < 149_597_870_700) {
    return `${(metres / 1000).toFixed(2)}km`
  } else {
    return `${(metres / 149_597_870_700).toFixed(2)}au`
  }
}
