import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as md5 from 'md5';
import * as path from 'path';

import { FileHandler } from './FileHandler';
import { req, reqResolve } from './request';

type FilenameAndExt = {
  filename: string,
  ext?: string
}

const extensions = ['png', 'jpeg', 'jpg']

function extractFilenameAndExtensionFromUri(uri: string): FilenameAndExt {
  function tryFileExtension(ext: string): FilenameAndExt | null {
    const pieces = uri.split(new RegExp(ext, 'i'))
    return pieces.length > 1
      ? { filename: `${md5(pieces[0])}`, ext }
      : null
  }

  return extensions
    .map(ext => tryFileExtension(ext))
    .find(ext => !!ext)
    || { filename: md5(uri) }
}

function addIndex(index: any, query: string, uri: string, file: string) {
  const entryForQuery = index[query] || []
  if (!entryForQuery.some((q: any) => q.uri === uri)) {
    index[query] = entryForQuery.concat({ uri, file })
  }
}

export class ImageDownloader {

  fileHandler: FileHandler
  index: any

  constructor(dirname: string) {
    this.fileHandler = new FileHandler(path.resolve(dirname))
    this.index = this.fileHandler.initOutputDir()
  }

  haveImage(uri: string) {
    const { filename } =  extractFilenameAndExtensionFromUri(uri)
    return extensions.some(
      ext => fs.existsSync(path.resolve(this.fileHandler.getImagesDirPath(), `${filename}.${ext}`))
    )
  }

  downloadImage(uri: string): Promise<string> {
    return reqResolve(uri, true).then((res) => {
      if (res instanceof Error) {
        return Promise.reject({
          error: `failed to request image for uri: ${uri}`,
          message: res.toString()
        })
      }

      const { filename, ext = null } =  extractFilenameAndExtensionFromUri(uri)

      const contentType = res.headers['content-type']
      const extension = extensions
        .map(ext => ((contentType || '').match(new RegExp(ext, 'i')) || [])[0])
        .find(ext => !!ext)
        || ext

      if (!extension) {
        return Promise.reject({
          error: `failed to get image file extension for uri: ${uri}`,
          message: `content-type: ${res.headers['content-type']}`
        })
      }

      const file = `${filename}.${extension}`
      this.fileHandler.writeImage(file, res.body)
      return Promise.resolve(file)
    })
  }

  downloadImages(query: string, maxImages: number) {

    return req(`https://www.google.de/search?q=${query.split(' ').join('+')}&source=lnms&tbm=isch`)
      .then((res: any) => {
        const $ = cheerio.load(res.body)

        const imgUris = Array.from(
          $('div.rg_meta').map((_, el) =>  JSON.parse((el.children[0].data || '')).ou)
        ) as any as string[]

        const newImgUris = imgUris.filter(uri => !this.haveImage(uri)).slice(0, maxImages)

        if (maxImages - newImgUris.length) {
          console.log('%s of %s images are already downloaded:', maxImages - newImgUris.length, maxImages)
        }

        return Promise.all(
          newImgUris.map(
            uri => this.downloadImage(uri)
              .then((file) => {
                console.log('download successful for uri:', uri)
                console.log('saved as filename:', file)
                addIndex(this.index, query, uri, file)
                this.fileHandler.persistIndexFile(this.index)
              })
              .catch(({ error, message}) => {
                console.log(error)
                console.log(message)
              })
          )
        )
      })
  }
}