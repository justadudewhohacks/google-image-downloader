# google-image-downloader

Query google images and download images in original size.

## Usage

``` javascript
import * as path from 'path';
import { ImageDownloader } from '../lib/ImageDownloader';

const downloader = new ImageDownloader(__dirname)

downloader.downloadImages('obama', 5)
```

## Run the example

``` bash
ts-node example.ts
```