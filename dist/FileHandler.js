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
    FileHandler.prototype.initOutputDir = function () {
        this.initFileOrDir(path.resolve(this.rootDir, 'output'));
        this.initFileOrDir(this.getImagesDirPath());
        return fs.existsSync(this.getIndexFilePath())
            ? JSON.parse(fs.readFileSync(this.getIndexFilePath()).toString())
            : {};
    };
    FileHandler.prototype.getImagesDirPath = function () {
        return path.resolve(this.rootDir, 'output', 'images');
    };
    FileHandler.prototype.persistIndexFile = function (index) {
        fs.writeFileSync(this.getIndexFilePath(), JSON.stringify(index));
    };
    FileHandler.prototype.writeImage = function (filename, imgData) {
        fs.writeFileSync(path.resolve(this.getImagesDirPath(), filename), imgData);
    };
    return FileHandler;
}());
exports.FileHandler = FileHandler;
//# sourceMappingURL=FileHandler.js.map