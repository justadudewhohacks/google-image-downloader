"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var FileHandler = /** @class */ (function () {
    function FileHandler(rootDir) {
        this.rootDir = rootDir;
    }
    FileHandler.prototype.initFileOrDir = function (dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    };
    FileHandler.prototype.getIndexFilePath = function () {
        return path.resolve(this.rootDir, 'output', 'index.json');
    };
    FileHandler.prototype.readIndexFile = function () {
        return fs.existsSync(this.getIndexFilePath())
            ? JSON.parse(fs.readFileSync(this.getIndexFilePath()).toString())
            : {};
    };
    FileHandler.prototype.initOutputDir = function () {
        this.initFileOrDir(path.resolve(this.rootDir, 'output'));
        this.initFileOrDir(this.getImagesDirPath());
        return this.readIndexFile();
    };
    FileHandler.prototype.getImagesDirPath = function () {
        return path.resolve(this.rootDir, 'output', 'images');
    };
    FileHandler.prototype.persistIndexFile = function (index) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fs.writeFile(_this.getIndexFilePath(), JSON.stringify(index), function (err) {
                if (err)
                    return reject(err);
                return resolve();
            });
        });
    };
    FileHandler.prototype.writeImage = function (filename, imgData) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fs.writeFile(path.resolve(_this.getImagesDirPath(), filename), imgData, function (err) {
                if (err)
                    return reject(err);
                return resolve();
            });
        });
    };
    FileHandler.prototype.readImage = function (filename) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            fs.readFile(path.resolve(_this.getImagesDirPath(), filename), function (err, data) {
                if (err)
                    return reject(err);
                return resolve(data);
            });
        });
    };
    return FileHandler;
}());
exports.FileHandler = FileHandler;
//# sourceMappingURL=FileHandler.js.map