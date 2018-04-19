/// <reference types="node" />
export declare function exists(filePath: string): Promise<boolean>;
export declare function readFile(filePath: string): Promise<Buffer>;
export declare function writeFile(filePath: string, data: Buffer | string): Promise<any>;
