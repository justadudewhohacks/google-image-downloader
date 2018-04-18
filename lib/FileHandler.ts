import * as fs from 'fs';
import * as path from 'path';

export class FileHandler {
  rootDir: string

  constructor(rootDir: string) {
    this.rootDir = rootDir
  }

  initFileOrDir(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
  }

  getIndexFilePath() {
    return path.resolve(this.rootDir, 'output', 'index.json')
  }

  readIndexFile() {
    return fs.existsSync(this.getIndexFilePath())
      ? JSON.parse(fs.readFileSync(this.getIndexFilePath()).toString())
      : {}
  }

  initOutputDir() {
    this.initFileOrDir(path.resolve(this.rootDir, 'output'))
    this.initFileOrDir(this.getImagesDirPath())

    return this.readIndexFile()
  }

  getImagesDirPath() {
    return path.resolve(this.rootDir, 'output', 'images')
  }

  persistIndexFile(index: any): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.getIndexFilePath(), JSON.stringify(index), (err: Error) => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }

  writeImage(filename: string, imgData: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(path.resolve(this.getImagesDirPath(), filename), imgData, (err: Error) => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }

  readImage(filename: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(this.getImagesDirPath(), filename), (err: Error, data: Buffer) => {
        if (err) return reject(err)
        return resolve(data)
      })
    })
  }
}
