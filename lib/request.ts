import * as request from 'request';

export function req(url: string, returnBuffer: boolean = false, timeout: number = 10000): Promise<request.Response> {
  return new Promise(function(resolve, reject) {
    const options = Object.assign(
      {},
      {
        url,
        isBuffer: true,
        timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
        }
      },
      returnBuffer ? { encoding: null } : {}
    )

    request.get(options, function(err, res) {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}

export function reqResolve(url: string, returnBuffer: boolean = false, timeout: number = 10000): Promise<request.Response | Error> {
  return req(url, returnBuffer, timeout).catch(err => Promise.resolve(new Error(err)))
}