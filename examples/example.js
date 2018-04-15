const { ImageDownloader } = require('../')

const downloader = new ImageDownloader(__dirname)

downloader.downloadImages('big bang theory', 5)