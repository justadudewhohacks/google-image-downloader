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
    haveImage(uri: string): boolean;
    downloadImage(uri: string): Promise<string>;
    downloadImages(query: string, maxImages: number): Promise<DownloadResult[]>;
}
