import * as md5 from 'md5';

export type FilenameAndExt = {
  filename: string,
  ext?: string
}

export const EXTENSIONS = ['png', 'jpeg', 'jpg']

export function extractFilenameAndExtensionFromUri(uri: string): FilenameAndExt {
  function tryFileExtension(ext: string): FilenameAndExt | null {
    const pieces = uri.split(new RegExp(ext, 'i'))
    return pieces.length > 1
      ? { filename: `${md5(pieces[0])}`, ext }
      : null
  }

  return EXTENSIONS
    .map(ext => tryFileExtension(ext))
    .find(ext => !!ext)
    || { filename: md5(uri) }
}

export function addIndex(index: any, query: string, uri: string, file: string) {
  const entryForQuery = index[query] || []
  if (!entryForQuery.some((q: any) => q.uri === uri)) {
    index[query] = entryForQuery.concat({ uri, file })
  }
}