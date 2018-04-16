import { FileHandler } from './FileHandler';
export declare class ImageDownloader {
    fileHandler: FileHandler;
    index: any;
    constructor(dirname: string);
    haveImage(uri: string): boolean;
    downloadImage(uri: string): Promise<string>;
    downloadImages(query: string, maxImages: number): Promise<void[]>;
}
