/// <reference types="node" />
export declare class FileHandler {
    rootDir: string;
    constructor(rootDir: string);
    initFileOrDir(dir: string): void;
    getIndexFilePath(): string;
    readIndexFile(): any;
    initOutputDir(): any;
    getImagesDirPath(): string;
    persistIndexFile(index: any): Promise<void>;
    writeImage(filename: string, imgData: string): Promise<void>;
    readImage(filename: string): Promise<Buffer>;
}
