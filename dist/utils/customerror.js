"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customeError = void 0;
class customeError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // this.status = statusCode >= 400 && statusCode <= 500? 'server Error' : 'Client error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.customeError = customeError;
