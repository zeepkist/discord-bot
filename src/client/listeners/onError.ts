import { log } from '../../utils/index.js'

export const onError = (error: Error): void => {
  log.error(error.message)
}
