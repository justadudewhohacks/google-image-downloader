"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _fs = require("fs");
var path = require("path");
var fs = require("./fsPromised");
var FileHandler = /** @class */ (function () {
    function FileHandler(rootDir) {
        this.rootDir = rootDir;
    }
    FileHandler.prototype.initFileOrDir = function (dir) {
        return !_fs.existsSync(dir) && _fs.mkdirSync(dir);
    };
    FileHandler.prototype.getOutputDirPath = function () {
        return path.resolve(this.rootDir, 'output');
    };
    FileHandler.prototype.getIndexFilePath = function () {
        return path.resolve(this.getOutputDirPath(), 'index.json');
    };
    FileHandler.prototype.getImagesDirPath = function () {
        return path.resolve(this.getOutputDirPath(), 'images');
    };
    FileHandler.prototype.readIndexFile = function () {
        return _fs.existsSync(this.getIndexFilePath())
            ? JSON.parse(_fs.readFileSync(this.getIndexFilePath()).toString())
            : {};
    };
    FileHandler.prototype.initOutputDir = function () {
        this.initFileOrDir(path.resolve(this.rootDir, 'output'));
        this.initFileOrDir(this.getImagesDirPath());
        return this.readIndexFile();
    };
    FileHandler.prototype.persistIndexFile = function (index) {
        return fs.writeFile(this.getIndexFilePath(), JSON.stringify(index));
    };
    FileHandler.prototype.writeImage = function (filename, imgData) {
        return fs.writeFile(path.resolve(this.getImagesDirPath(), filename), imgData);
    };
    FileHandler.prototype.readImage = function (filename) {
        return fs.readFile(path.resolve(this.getImagesDirPath(), filename));
    };
    return FileHandler;
}());
exports.FileHandler = FileHandler;
//# sourceMappingURL=FileHandler.js.map