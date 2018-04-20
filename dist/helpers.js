"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var md5 = require("md5");
exports.EXTENSIONS = ['png', 'jpeg', 'jpg'];
function extractFilenameAndExtensionFromUri(uri) {
    function tryFileExtension(ext) {
        var pieces = uri.split(new RegExp(ext, 'i'));
        return pieces.length > 1
            ? { filename: "" + md5(pieces[0]), ext: ext }
            : null;
    }
    return exports.EXTENSIONS
        .map(function (ext) { return tryFileExtension(ext); })
        .find(function (ext) { return !!ext; })
        || { filename: md5(uri) };
}
exports.extractFilenameAndExtensionFromUri = extractFilenameAndExtensionFromUri;
function addIndex(index, query, uri, file) {
    var entryForQuery = index[query] || [];
    if (!entryForQuery.some(function (q) { return q.uri === uri; })) {
        index[query] = entryForQuery.concat({ uri: uri, file: file });
    }
}
exports.addIndex = addIndex;
//# sourceMappingURL=helpers.js.map