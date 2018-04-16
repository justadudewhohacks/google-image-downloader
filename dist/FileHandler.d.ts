export declare class FileHandler {
    rootDir: string;
    constructor(rootDir: string);
    initFileOrDir(dir: string): void;
    getIndexFilePath(): string;
    initOutputDir(): any;
    getImagesDirPath(): string;
    persistIndexFile(index: any): void;
    writeImage(filename: string, imgData: string): void;
}
