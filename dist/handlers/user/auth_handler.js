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
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const auth_controller_1 = require("../../services/user/auth-controller");
const orderModel_1 = require("../../models/user/orderModel");
dotenv.config({ path: path_1.default.join(__dirname, '../../config.env') });
const signUp = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield auth_controller_1.userSrvc.signUp(req, res, next);
    const token = auth_controller_1.userSrvc.userToken();
    res.status(200).json({
        status: "Success",
        token,
        data: {
            users
        }
    });
}));
const logIn = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const logedValue = yield auth_controller_1.userSrvc.logIn(req, res, next);
}));
const viewProduct = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield auth_controller_1.userSrvc.products(req, res, next);
    res.status(200).json({
        status: "OK",
        total_Products: products.length,
        datas: {
            products
        }
    });
}));
const categorizedProducts = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield auth_controller_1.userSrvc.productByCategory(req, res, next);
}));
const productById = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield auth_controller_1.userSrvc.productById(req, res, next);
}));
const addToCart = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    auth_controller_1.userSrvc.addToCart(req, res, next);
}));
const viewCart = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    auth_controller_1.userSrvc.viewCart(req, res, next);
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
const addToOrder = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    auth_controller_1.userSrvc.addToOrder(req, res, next);
}));
const deleteall = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield orderModel_1.orderModel.deleteMany();
}));
exports.userControllers = {
    signUp,
    logIn,
    viewProduct,
    categorizedProducts,
    productById,
    addToCart,
    viewCart,
    addWishList,
    viewWishlist,
    deleteWishlistprdct,
    addToOrder,
    deleteall
};
