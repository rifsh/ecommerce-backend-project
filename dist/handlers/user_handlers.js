"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logIn = exports.signUp = void 0;
const usermodel_1 = require("../models/usermodel");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const customerror_1 = require("../utils/customerror");
//JWT_token
let userToken = (id) => {
    return jsonwebtoken_1.default.sign({ id: id }, 'asd-qwe-asd-qwe', {
        expiresIn: 30000000
    });
};
exports.signUp = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield usermodel_1.Users.create(req.body);
    const token = userToken(newUser._id);
    res.status(200).json({
        status: "OK",
        token,
        data: {
            user: newUser
        }
    });
}));
// asyncErrorHandler(signUp)
exports.logIn = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const usrname = req.body.usrname;
    const password = req.body.password;
    if (!usrname || !password) {
        const err = new customerror_1.customeError(`Please provide a email and password`, 404);
        return next(err);
    }
    const logedUser = yield usermodel_1.Users.findOne({ usrname }).select('+password');
    if (!logedUser || !(yield logedUser.comparePassword(password, logedUser.password))) {
        const error = new customerror_1.customeError('Incorrect username or password', 404);
        return next(error);
    }
    const token = userToken(logedUser._id);
    res.status(200).json({
        status: "Valid",
        token,
        datas: {
            user: logedUser
        },
    });
}));
