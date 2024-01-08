"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomeError = void 0;
class CustomeError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode <= 500 ? 'server Error' : 'Client error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomeError = CustomeError;
