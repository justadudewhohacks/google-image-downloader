import { FileHandler } from './FileHandler';
export declare type DownloadResult = {
    uri: string;
    filename?: string;
    error?: Error | string;
    message?: string;
};
export declare class ImageDownloader {
    fileHandler: FileHandler;
    index: any;
    isLoggingEnabled: boolean;
    writeIndexFile: boolean;
    constructor(dirname: string, isLoggingEnabled?: boolean, writeIndexFile?: boolean);
    log(...args: any[]): void;
    haveImage(filename: string, _: string, __: string): Promise<boolean>;
    getNewImageUris(imgUris: string[], query: string): Promise<string[]>;
    downloadImage(uri: string, timeout?: number): Promise<string>;
    downloadImages(query: string, maxImages: number, timeout?: number): Promise<DownloadResult[]>;
}
