import * as request from 'request';
export declare function req(url: string, returnBuffer?: boolean, timeout?: number): Promise<request.Response>;
export declare function reqResolve(url: string, returnBuffer?: boolean, timeout?: number): Promise<request.Response | Error>;
