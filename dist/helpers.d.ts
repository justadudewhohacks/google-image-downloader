export declare type FilenameAndExt = {
    filename: string;
    ext?: string;
};
export declare const EXTENSIONS: string[];
export declare function extractFilenameAndExtensionFromUri(uri: string): FilenameAndExt;
export declare function addIndex(index: any, query: string, uri: string, file: string): void;
