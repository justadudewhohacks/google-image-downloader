"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var cheerio = require("cheerio");
var fs = require("./fsPromised");
var path = require("path");
var FileHandler_1 = require("./FileHandler");
var request_1 = require("./request");
var helpers_1 = require("./helpers");
var isNotFalsy = function (val) { return val; };
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
    ImageDownloader.prototype.haveImage = function (filename, _, __) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var results;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(helpers_1.EXTENSIONS.map(function (ext) { return fs.exists(path.resolve(_this.fileHandler.getImagesDirPath(), filename + "." + ext)); }))];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results.some(isNotFalsy)];
                }
            });
        });
    };
    ImageDownloader.prototype.getNewImageUris = function (imgUris, query) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(imgUris.map(function (uri) { return tslib_1.__awaiter(_this, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.haveImage(helpers_1.extractFilenameAndExtensionFromUri(uri).filename, uri, query)];
                                case 1: return [2 /*return*/, (_a.sent()) ? null : uri];
                            }
                        }); }); }))];
                    case 1: return [2 /*return*/, (_a.sent())
                            .filter(isNotFalsy)];
                }
            });
        });
    };
    ImageDownloader.prototype.downloadImage = function (uri, timeout) {
        if (timeout === void 0) { timeout = 10000; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var res, _a, filename, _b, ext, contentType, extension, file;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, request_1.reqResolve(uri, true, timeout)];
                    case 1:
                        res = _c.sent();
                        if (res instanceof Error) {
                            return [2 /*return*/, Promise.reject({
                                    error: "failed to request image for uri: " + uri,
                                    message: res.toString()
                                })];
                        }
                        _a = helpers_1.extractFilenameAndExtensionFromUri(uri), filename = _a.filename, _b = _a.ext, ext = _b === void 0 ? null : _b;
                        contentType = res.headers['content-type'];
                        extension = helpers_1.EXTENSIONS
                            .map(function (ext) { return ((contentType || '').match(new RegExp(ext, 'i')) || [])[0]; })
                            .find(isNotFalsy)
                            || ext;
                        if (!extension) {
                            return [2 /*return*/, Promise.reject({
                                    error: "failed to get image file extension for uri: " + uri,
                                    message: "content-type: " + res.headers['content-type']
                                })];
                        }
                        file = filename + "." + extension;
                        return [4 /*yield*/, this.fileHandler.writeImage(file, res.body)];
                    case 2:
                        _c.sent();
                        return [2 /*return*/, file];
                }
            });
        });
    };
    ImageDownloader.prototype.downloadImages = function (query, maxImages, timeout) {
        if (timeout === void 0) { timeout = 10000; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var res, $, imgUris, newImgUris;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request_1.req("https://www.google.de/search?q=" + query.split(' ').join('+') + "&source=lnms&tbm=isch")];
                    case 1:
                        res = _a.sent();
                        $ = cheerio.load(res.body);
                        imgUris = Array.from($('div.rg_meta').map(function (_, el) { return JSON.parse((el.children[0].data || '')).ou; }));
                        return [4 /*yield*/, this.getNewImageUris(imgUris, query)];
                    case 2:
                        newImgUris = (_a.sent()).slice(0, maxImages);
                        if (maxImages - newImgUris.length) {
                            this.log('%s of %s images are already downloaded:', maxImages - newImgUris.length, maxImages);
                        }
                        return [2 /*return*/, Promise.all(newImgUris.map(function (uri) { return _this.downloadImage(uri, timeout)
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
                            }); }))];
                }
            });
        });
    };
    return ImageDownloader;
}());
exports.ImageDownloader = ImageDownloader;
//# sourceMappingURL=ImageDownloader.js.map