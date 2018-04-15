# google-image-downloader

Query google images and download images in original size.

## Usage

``` javascript
import { ImageDownloader } from '../lib/ImageDownloader';

const downloader = new ImageDownloader(__dirname)

downloader.downloadImages('big bang theory', 5)
```

## Run the example

``` bash
node example.js
```

or

``` bash
ts-node example.ts
```