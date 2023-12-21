import { NextFunction, Request, Response } from "express";

export const errorHandler = (error, req: Request, res: Response, next: NextFunction) => {
    error.statuscode = error.statuscode || 404;
    error.status = error.status || 'error';
    res.status(error.statuscode).json({
        status: error.statuscode,
        message: error.message
    })
    next(error)
}