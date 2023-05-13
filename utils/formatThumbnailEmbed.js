import { URL } from 'node:url';
export const formatThumbnailEmbed = (url) => {
    if (url.startsWith('https://storage.googleapis.com/zeepkist-gtr/thumbnails/')) {
        return new URL(url).toString();
    }
    const baseUrlRegex = /^(https?:\/\/[^/]+)\/download\/storage\/v1\/b\/([^/]+)\/o\//;
    const queryParametersRegex = /\?.*$/;
    const match = url.match(baseUrlRegex);
    if (!match) {
        throw new Error('Invalid URL format');
    }
    const baseUrl = match[1] + '/' + match[2] + '/';
    const path = url.replace(baseUrlRegex, '').replace(queryParametersRegex, '');
    const decodedPath = decodeURIComponent(path);
    const parts = decodedPath.split('/');
    const newParts = parts.map(part => {
        return part.startsWith('thumbnails%2F')
            ? part.replace('thumbnails%2F', '')
            : part;
    });
    const newPath = newParts.join('/');
    return new URL(baseUrl + newPath).toString();
};
