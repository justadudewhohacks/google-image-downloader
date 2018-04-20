import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

import { FileHandler } from './FileHandler';
import { req, reqResolve } from './request';
import { extractFilenameAndExtensionFromUri, EXTENSIONS, addIndex } from './helpers';

export type DownloadResult = {
  uri: string
  filename?: string
  error?: Error | string
  message?: string
}

export class ImageDownloader {

  fileHandler: FileHandler
  index: any
  isLoggingEnabled: boolean
  writeIndexFile: boolean

  constructor(dirname: string, isLoggingEnabled: boolean = true, writeIndexFile: boolean = true) {
    this.fileHandler = new FileHandler(path.resolve(dirname))
    this.index = this.fileHandler.initOutputDir()
    this.isLoggingEnabled = isLoggingEnabled
    this.writeIndexFile = writeIndexFile
  }

  log(...args: any[]) {
    if (this.isLoggingEnabled) {
      console.log(...args)
    }
  }

  haveImage(uri: string) {
    const { filename } =  extractFilenameAndExtensionFromUri(uri)
    return EXTENSIONS.some(
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
      const extension = EXTENSIONS
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
      return this.fileHandler.writeImage(file, res.body)
        .then(() => file)
    })
  }

  downloadImages(query: string, maxImages: number): Promise<DownloadResult[]> {

    return req(`https://www.google.de/search?q=${query.split(' ').join('+')}&source=lnms&tbm=isch`)
      .then((res: any) => {
        const $ = cheerio.load(res.body)

        const imgUris = Array.from(
          $('div.rg_meta').map((_, el) =>  JSON.parse((el.children[0].data || '')).ou)
        ) as any as string[]

        const newImgUris = imgUris.filter(uri => !this.haveImage(uri)).slice(0, maxImages)

        if (maxImages - newImgUris.length) {
          this.log('%s of %s images are already downloaded:', maxImages - newImgUris.length, maxImages)
        }

        return Promise.all(
          newImgUris.map(
            uri => this.downloadImage(uri)
              .then((filename: string) => {
                this.log('download successful for uri:', uri)
                this.log('saved as filename:', filename)

                const result = { uri, filename }

                if (this.writeIndexFile) {
                  addIndex(this.index, query, uri, filename)
                  this.fileHandler.persistIndexFile(this.index)
                    .then(() => result)
                    .catch(err => this.log(err))
                }
                return result
              })
              .catch(({ error, message }) => {
                this.log(error)
                this.log(message)
                return { uri, error, message }
              })
          )
        )
      })
  }
}