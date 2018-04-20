"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio = require("cheerio");
var fs = require("fs");
var path = require("path");
var FileHandler_1 = require("./FileHandler");
var request_1 = require("./request");
var helpers_1 = require("./helpers");
var ImageDownloader = /** @class */ (function () {
    function ImageDownloader(dirname, isLoggingEnabled, writeIndexFile) {
        if (isLoggingEnabled === void 0) { isLoggingEnabled = true; }
        if (writeIndexFile === void 0) { writeIndexFile = true; }
        this.fileHandler = new FileHandler_1.FileHandler(path.resolve(dirname));
        this.index = this.fileHandler.initOutputDir();
        this.isLoggingEnabled = isLoggingEnabled;
        this.writeIndexFile = writeIndexFile;
    }
    ImageDownloader.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.isLoggingEnabled) {
            console.log.apply(console, args);
        }
    };
    ImageDownloader.prototype.haveImage = function (uri) {
        var _this = this;
        var filename = helpers_1.extractFilenameAndExtensionFromUri(uri).filename;
        return helpers_1.EXTENSIONS.some(function (ext) { return fs.existsSync(path.resolve(_this.fileHandler.getImagesDirPath(), filename + "." + ext)); });
    };
    ImageDownloader.prototype.downloadImage = function (uri) {
        var _this = this;
        return request_1.reqResolve(uri, true).then(function (res) {
            if (res instanceof Error) {
                return Promise.reject({
                    error: "failed to request image for uri: " + uri,
                    message: res.toString()
                });
            }
            var _a = helpers_1.extractFilenameAndExtensionFromUri(uri), filename = _a.filename, _b = _a.ext, ext = _b === void 0 ? null : _b;
            var contentType = res.headers['content-type'];
            var extension = helpers_1.EXTENSIONS
                .map(function (ext) { return ((contentType || '').match(new RegExp(ext, 'i')) || [])[0]; })
                .find(function (ext) { return !!ext; })
                || ext;
            if (!extension) {
                return Promise.reject({
                    error: "failed to get image file extension for uri: " + uri,
                    message: "content-type: " + res.headers['content-type']
                });
            }
            var file = filename + "." + extension;
            return _this.fileHandler.writeImage(file, res.body)
                .then(function () { return file; });
        });
    };
    ImageDownloader.prototype.downloadImages = function (query, maxImages) {
        var _this = this;
        return request_1.req("https://www.google.de/search?q=" + query.split(' ').join('+') + "&source=lnms&tbm=isch")
            .then(function (res) {
            var $ = cheerio.load(res.body);
            var imgUris = Array.from($('div.rg_meta').map(function (_, el) { return JSON.parse((el.children[0].data || '')).ou; }));
            var newImgUris = imgUris.filter(function (uri) { return !_this.haveImage(uri); }).slice(0, maxImages);
            if (maxImages - newImgUris.length) {
                _this.log('%s of %s images are already downloaded:', maxImages - newImgUris.length, maxImages);
            }
            return Promise.all(newImgUris.map(function (uri) { return _this.downloadImage(uri)
                .then(function (filename) {
                _this.log('download successful for uri:', uri);
                _this.log('saved as filename:', filename);
                var result = { uri: uri, filename: filename };
                if (_this.writeIndexFile) {
                    helpers_1.addIndex(_this.index, query, uri, filename);
                    _this.fileHandler.persistIndexFile(_this.index)
                        .then(function () { return result; })
                        .catch(function (err) { return _this.log(err); });
                }
                return result;
            })
                .catch(function (_a) {
                var error = _a.error, message = _a.message;
                _this.log(error);
                _this.log(message);
                return { uri: uri, error: error, message: message };
            }); }));
        });
    };
    return ImageDownloader;
}());
exports.ImageDownloader = ImageDownloader;
//# sourceMappingURL=ImageDownloader.js.map