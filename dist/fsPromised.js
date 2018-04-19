"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function exists(filePath) {
    return new Promise(function (resolve) {
        fs.exists(filePath, function (exists) {
            return resolve(exists);
        });
    });
}
exports.exists = exists;
function readFile(filePath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, function (err, data) {
            if (err)
                return reject(err);
            return resolve(data);
        });
    });
}
exports.readFile = readFile;
function writeFile(filePath, data) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(filePath, data, function (err) {
            if (err)
                return reject(err);
            return resolve();
        });
    });
}
exports.writeFile = writeFile;
//# sourceMappingURL=fsPromised.js.map