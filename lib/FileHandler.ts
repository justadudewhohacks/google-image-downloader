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

  initOutputDir() {
    this.initFileOrDir(path.resolve(this.rootDir, 'output'))
    this.initFileOrDir(this.getImagesDirPath())

    return fs.existsSync(this.getIndexFilePath())
      ? JSON.parse(fs.readFileSync(this.getIndexFilePath()).toString())
      : {}
  }

  getImagesDirPath() {
    return path.resolve(this.rootDir, 'output', 'images')
  }

  persistIndexFile(index) {
    fs.writeFileSync(this.getIndexFilePath(), JSON.stringify(index))
  }

  writeImage(filename: string, imgData: string) {
    fs.writeFileSync(path.resolve(this.getImagesDirPath(), filename), imgData)
  }
}
