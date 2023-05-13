import { URL } from 'node:url'

/**
 * Converts the following URL:
 *
 * https://storage.googleapis.com/download/storage/v1/b/zeepkist-gtr/o/thumbnails%2F28032023-213839968-Happydr-791691801402-543.jpeg?generation=1680194142366761&alt=media
 *
 * to this URL that can be used as an embed thumbnail:
 *
 * https://storage.googleapis.com/zeepkist-gtr/thumbnails/28032023-213839968-Happydr-791691801402-543.jpeg
 */
export const formatThumbnailEmbed = (url: string): string => {
  if (
    url.startsWith('https://storage.googleapis.com/zeepkist-gtr/thumbnails/')
  ) {
    return new URL(url).toString()
  }

  const baseUrlRegex =
    /^(https?:\/\/[^/]+)\/download\/storage\/v1\/b\/([^/]+)\/o\//
  const queryParametersRegex = /\?.*$/
  const match = url.match(baseUrlRegex)
  if (!match) {
    throw new Error('Invalid URL format')
  }
  const baseUrl = match[1] + '/' + match[2] + '/'
  const path = url.replace(baseUrlRegex, '').replace(queryParametersRegex, '')
  const decodedPath = decodeURIComponent(path)
  const parts = decodedPath.split('/')
  const newParts = parts.map(part => {
    return part.startsWith('thumbnails%2F')
      ? part.replace('thumbnails%2F', '')
      : part
  })
  const newPath = newParts.join('/')
  return new URL(baseUrl + newPath).toString()
}
