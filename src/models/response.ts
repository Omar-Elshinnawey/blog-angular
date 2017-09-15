export interface MResponse<T>{
    message: string;
    result: T;
    token?: string;
}