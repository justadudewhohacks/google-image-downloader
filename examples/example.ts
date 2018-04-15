import * as path from 'path';

import { ImageDownloader } from '../lib/ImageDownloader';

const downloader = new ImageDownloader(__dirname)

downloader.downloadImages('big bang theory', 5)