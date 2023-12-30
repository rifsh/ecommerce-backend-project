"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const userRouter_1 = require("./routers/userRouter");
const adminRouter_1 = require("./routers/adminRouter");
const customerror_1 = require("./utils/customerror");
const errormiddlaware_1 = require("./handlers/errormiddlaware");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use('/api/users', userRouter_1.userRouter);
exports.app.use('/api/admin', adminRouter_1.adminRouter);
exports.app.all('*', (req, res, next) => {
    const err = new customerror_1.customeError(`Can't find url '${req.originalUrl}' on the server!`, 404);
    next(err);
});
exports.app.use(errormiddlaware_1.errorHandler);
