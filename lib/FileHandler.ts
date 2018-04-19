import * as _fs from 'fs';
import * as path from 'path';

import * as fs from './fsPromised';

export class FileHandler {
  rootDir: string

  constructor(rootDir: string) {
    this.rootDir = rootDir
  }

  initFileOrDir(dir: string) {
    return !_fs.existsSync(dir) && _fs.mkdirSync(dir)
  }

  getOutputDirPath() {
    return path.resolve(this.rootDir, 'output')
  }

  getIndexFilePath() {
    return path.resolve(this.getOutputDirPath(), 'index.json')
  }

  getImagesDirPath() {
    return path.resolve(this.getOutputDirPath(), 'images')
  }

  readIndexFile() {
    return _fs.existsSync(this.getIndexFilePath())
      ? JSON.parse(_fs.readFileSync(this.getIndexFilePath()).toString())
      : {}
  }

  initOutputDir() {
    this.initFileOrDir(path.resolve(this.rootDir, 'output'))
    this.initFileOrDir(this.getImagesDirPath())

    return this.readIndexFile()
  }

  persistIndexFile(index: any): Promise<void> {
    return fs.writeFile(this.getIndexFilePath(), JSON.stringify(index))
  }

  writeImage(filename: string, imgData: string): Promise<void> {
    return fs.writeFile(path.resolve(this.getImagesDirPath(), filename), imgData)
  }

  readImage(filename: string): Promise<Buffer> {
    return fs.readFile(path.resolve(this.getImagesDirPath(), filename))
  }
}
