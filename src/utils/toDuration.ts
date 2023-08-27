export const toDuration = (seconds = 0) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds - hours * 3600) / 60)
  const remainingSeconds = seconds - hours * 3600 - minutes * 60

  const hoursString = hours ? `${hours}h ` : ''
  const minutesString = minutes ? `${minutes}m ` : ''
  const secondsString = remainingSeconds
    ? `${remainingSeconds.toFixed(0)}s`
    : ''

  const duration = `${hoursString}${minutesString}${secondsString}`

  return duration === '' ? '0s' : duration
}
