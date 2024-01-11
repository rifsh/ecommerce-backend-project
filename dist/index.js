"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const userRouter_1 = require("./routers/userRouter");
const adminRouter_1 = require("./routers/adminRouter");
const customerror_1 = require("./utils/customerror");
const app = (0, express_1.default)();
// app.use(bodyparser);
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api/users', userRouter_1.userRouter);
app.use('/api/admin', adminRouter_1.adminRouter);
app.all('*', (req, res, next) => {
    const err = new customerror_1.CustomeError(`Can't find url '${req.originalUrl}' on the server!`, 404);
    next(err);
});
exports.default = app;
