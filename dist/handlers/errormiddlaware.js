"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
    error.statuscode = error.statuscode || 404;
    error.status = error.status || 'error';
    res.status(error.statuscode).json({
        status: error.statuscode,
        message: error.message
    });
    next(error);
};
exports.errorHandler = errorHandler;
