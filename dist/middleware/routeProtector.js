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
exports.adminRouteProtecter = exports.userRouteProtecter = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const customerror_1 = require("../utils/customerror");
const usermodel_1 = require("../models/user/usermodel");
const path_1 = __importDefault(require("path"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../config.env') });
exports.userRouteProtecter = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //Reading the token and check if it exist
    let token;
    const testToken = req.headers.authorization;
    if (testToken && testToken.startsWith('bearer')) {
        const sampleToken = testToken.split(' ');
        token = sampleToken[1];
    }
    if (!token) {
        next(new customerror_1.CustomeError('You are not logged in !!', 402));
    }
    //Validate the token
    const tokenDecode = yield jsonwebtoken_1.default.verify(token, process.env.jwt_string);
    const tokenDec = tokenDecode;
    //If the user exist
    let user = yield usermodel_1.Users.findById(tokenDec.id);
    if (!user) {
        next(new customerror_1.CustomeError('User is not present', 401));
    }
    next();
}));
exports.adminRouteProtecter = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    const headerToken = req.headers.authorization;
    if (!headerToken) {
        next(new customerror_1.CustomeError('Please provide a token', 401));
    }
    if (headerToken && headerToken.toLowerCase().startsWith('bearer')) {
        token = headerToken.split(' ')[1];
    }
    if (!token) {
        next(new customerror_1.CustomeError('You are not logged in !!', 402));
    }
    const tokenDecode = yield jsonwebtoken_1.default.verify(token, process.env.jwt_string);
    const tokenDec = tokenDecode;
    const admin = process.env.ADMIN_USRNAME === tokenDec.name;
    if (!admin) {
        next(new customerror_1.CustomeError('Admin is not present', 401));
    }
    next();
}));
