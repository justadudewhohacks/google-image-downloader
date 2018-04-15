import * as request from 'request';

export function req(url: string, returnBuffer: boolean = false): Promise<request.Response> {
  return new Promise(function(resolve, reject) {
    const options = Object.assign(
      {},
      {
        url,
        isBuffer: true,
        timeout: 10000,
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

export function reqResolve(url: string, returnBuffer: boolean = false): Promise<request.Response | Error> {
  return req(url, returnBuffer).catch(err => Promise.resolve(new Error(err)))
}