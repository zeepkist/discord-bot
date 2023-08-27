export const toDistance = (metres = 0) => {
  if (metres < 0.01) {
    return '0m'
  } else if (metres < 1000) {
    return `${metres.toFixed(2)}m`
  } else if (metres < 1_000_000) {
    return `${(metres / 1000).toFixed(2)}km`
  } else if (metres < 1_000_000_000) {
    return `${(metres / 1_000_000).toFixed(2)}Mm`
  } else if (metres < 1_000_000_000_000) {
    return `${(metres / 1_000_000_000).toFixed(2)}Gm`
  } else {
    return `${(metres / 1_000_000_000_000).toFixed(2)}Tm`
  }
}
