import * as fs from 'fs';

export function exists(filePath: string): Promise<boolean> {
  return new Promise((resolve) => {
    fs.exists(filePath, (exists: boolean) => {
      return resolve(exists)
    })
  })
}

export function readFile(filePath: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err: Error, data: Buffer) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

export function writeFile(filePath: string, data: Buffer | string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err: Error) => {
      if (err) return reject(err)
      return resolve()
    })
  })
}