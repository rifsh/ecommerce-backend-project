export class customeError extends Error {
    statusCode:number;
    status:string;
    isOperational:boolean;

    constructor(message:string, statusCode:number) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode <= 500? 'server Error' : 'Client error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}