/// <reference types="node" />
export declare class FileHandler {
    rootDir: string;
    constructor(rootDir: string);
    initFileOrDir(dir: string): false | void;
    getOutputDirPath(): string;
    getIndexFilePath(): string;
    getImagesDirPath(): string;
    readIndexFile(): any;
    initOutputDir(): any;
    persistIndexFile(index: any): Promise<void>;
    writeImage(filename: string, imgData: string): Promise<void>;
    readImage(filename: string): Promise<Buffer>;
}
