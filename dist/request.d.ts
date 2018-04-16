import * as request from 'request';
export declare function req(url: string, returnBuffer?: boolean): Promise<request.Response>;
export declare function reqResolve(url: string, returnBuffer?: boolean): Promise<request.Response | Error>;
