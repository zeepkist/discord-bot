import { formatDistanceToNowStrict } from 'date-fns'

export const formatRelativeDate = date => {
  return formatDistanceToNowStrict(new Date(date), {
    addSuffix: true
  })
}
