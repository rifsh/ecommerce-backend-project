"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.userControllers = void 0;
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
const usermodel_1 = require("../models/user/usermodel");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const customerror_1 = require("../utils/customerror");
const auth_controller_1 = require("../services/user/auth-controller");
dotenv.config({ path: path_1.default.join(__dirname, '../../config.env') });
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    auth_controller_1.userSrvc.signUp(req, res, next);
});
const logIn = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    auth_controller_1.userSrvc.logIn(req, res, next);
}));
const addToCart = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    auth_controller_1.userSrvc.addToCart(req, res, next);
}));
const viewCart = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    auth_controller_1.userSrvc.viewCart(req, res, next);
}));
const protectRoute = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //Reading the token and check if it exist
    let token;
    const testToken = req.headers.authorization;
    if (testToken && testToken.startsWith('bearer')) {
        const sampleToken = testToken.split(' ');
        token = sampleToken[1];
    }
    if (!token) {
        next(new customerror_1.customeError('You are not logged in !!', 402));
    }
    //Validate the token
    const tokenDecode = yield jsonwebtoken_1.default.verify(token, process.env.jwt_string);
    let decodeId;
    for (const key in tokenDecode) {
        if (key === 'id') {
            decodeId = tokenDecode[key];
        }
    }
    //If the user exist
    const user = yield usermodel_1.Users.findById(decodeId);
    if (!user) {
        next(new customerror_1.customeError('User is not present', 401));
    }
    //If the user changed the password after the was issuea
    //Allow the user access the route
    next();
}));
const addWishList = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    auth_controller_1.userSrvc.addToWishList(req, res, next);
}));
const viewWishlist = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    auth_controller_1.userSrvc.viewWishList(req, res, next);
}));
const deleteWishlistprdct = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    auth_controller_1.userSrvc.deleteWishList(req, res, next);
}));
exports.userControllers = {
    signUp,
    logIn,
    addToCart,
    viewCart,
    addWishList,
    viewWishlist,
    deleteWishlistprdct,
    protectRoute
};
