export const numberToMonospace = number => {
  const digits = ['𝟶', '𝟷', '𝟸', '𝟹', '𝟺', '𝟻', '𝟼', '𝟽', '𝟾', '𝟿']
  return [...number.toString()].map(digit => digits[Number(digit)]).join('')
}
