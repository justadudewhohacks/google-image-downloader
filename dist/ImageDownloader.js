"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio = require("cheerio");
var fs = require("fs");
var md5 = require("md5");
var path = require("path");
var FileHandler_1 = require("./FileHandler");
var request_1 = require("./request");
var extensions = ['png', 'jpeg', 'jpg'];
function extractFilenameAndExtensionFromUri(uri) {
    function tryFileExtension(ext) {
        var pieces = uri.split(new RegExp(ext, 'i'));
        return pieces.length > 1
            ? { filename: "" + md5(pieces[0]), ext: ext }
            : null;
    }
    return extensions
        .map(function (ext) { return tryFileExtension(ext); })
        .find(function (ext) { return !!ext; })
        || { filename: md5(uri) };
}
function addIndex(index, query, uri, file) {
    var entryForQuery = index[query] || [];
    if (!entryForQuery.some(function (q) { return q.uri === uri; })) {
        index[query] = entryForQuery.concat({ uri: uri, file: file });
    }
}
var ImageDownloader = /** @class */ (function () {
    function ImageDownloader(dirname) {
        this.fileHandler = new FileHandler_1.FileHandler(path.resolve(dirname));
        this.index = this.fileHandler.initOutputDir();
    }
    ImageDownloader.prototype.haveImage = function (uri) {
        var _this = this;
        var filename = extractFilenameAndExtensionFromUri(uri).filename;
        return extensions.some(function (ext) { return fs.existsSync(path.resolve(_this.fileHandler.getImagesDirPath(), filename + "." + ext)); });
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
            var _a = extractFilenameAndExtensionFromUri(uri), filename = _a.filename, _b = _a.ext, ext = _b === void 0 ? null : _b;
            var contentType = res.headers['content-type'];
            var extension = extensions
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
                console.log('%s of %s images are already downloaded:', maxImages - newImgUris.length, maxImages);
            }
            return Promise.all(newImgUris.map(function (uri) { return _this.downloadImage(uri)
                .then(function (file) {
                console.log('download successful for uri:', uri);
                console.log('saved as filename:', file);
                addIndex(_this.index, query, uri, file);
                return _this.fileHandler.persistIndexFile(_this.index)
                    .catch(function (err) { return console.log(err); });
            })
                .catch(function (_a) {
                var error = _a.error, message = _a.message;
                console.log(error);
                console.log(message);
            }); }));
        });
    };
    return ImageDownloader;
}());
exports.ImageDownloader = ImageDownloader;
//# sourceMappingURL=ImageDownloader.js.map