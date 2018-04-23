"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
function req(url, returnBuffer, timeout) {
    if (returnBuffer === void 0) { returnBuffer = false; }
    if (timeout === void 0) { timeout = 10000; }
    return new Promise(function (resolve, reject) {
        var options = Object.assign({}, {
            url: url,
            isBuffer: true,
            timeout: timeout,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
            }
        }, returnBuffer ? { encoding: null } : {});
        request.get(options, function (err, res) {
            if (err)
                return reject(err);
            return resolve(res);
        });
    });
}
exports.req = req;
function reqResolve(url, returnBuffer, timeout) {
    if (returnBuffer === void 0) { returnBuffer = false; }
    if (timeout === void 0) { timeout = 10000; }
    return req(url, returnBuffer, timeout).catch(function (err) { return Promise.resolve(new Error(err)); });
}
exports.reqResolve = reqResolve;
//# sourceMappingURL=request.js.map