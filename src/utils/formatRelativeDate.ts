import { formatDistanceToNowStrict } from 'date-fns'

export const formatRelativeDate = (date: string) => {
  return formatDistanceToNowStrict(new Date(date), {
    addSuffix: true
  })
    .replaceAll('second', 'sec')
    .replaceAll('minute', 'min')
}
