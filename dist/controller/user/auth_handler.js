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
const token_1 = require("../../utils/token");
const orderModel_1 = require("../../models/user/orderModel");
const customerror_1 = require("../../utils/customerror");
const usermodel_1 = require("../../models/user/usermodel");
dotenv.config({ path: path_1.default.join(__dirname, '../../config.env') });
const signUp = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userDatas = req.body;
    const users = yield auth_controller_1.userSrvc.signUp(userDatas);
    const token = (0, token_1.userToken)();
    res.status(200).json({
        status: "Success",
        token,
        data: {
            users
        }
    });
}));
const logIn = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userName = req.body.username;
    const password = req.body.password;
    const userDetails = yield usermodel_1.Users.findOne({ usrname: userName });
    const logedValue = yield auth_controller_1.userSrvc.logIn(userName, password, next);
    res.status(200).json({
        status: "Valid",
        token: logedValue,
        user: userDetails
    });
}));
const viewProduct = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield auth_controller_1.userSrvc.products();
    res.status(200).json({
        status: "OK",
        total_Products: products.length,
        datas: products
    });
}));
const categorizedProducts = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const category = req.params.id;
    const products = yield auth_controller_1.userSrvc.productByCategory(category, next);
    res.status(200).json({
        totalPrdoucts: products.length,
        datas: products
    });
}));
const productById = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productID = req.params.id;
    const products = yield auth_controller_1.userSrvc.productById(productID, next);
    res.status(200).json({
        id: productID,
        datas: products
    });
}));
const addToCart = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.body.productId;
    const userId = req.params.id;
    auth_controller_1.userSrvc.addToCart(productId, userId, res, next);
}));
const viewCart = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const carts = yield auth_controller_1.userSrvc.viewCart(userId);
    if (carts) {
        res.status(200).json({
            totalProducts: carts.length,
            datas: carts
        });
    }
    else {
        next(new customerror_1.CustomeError("Cart is not found", 404));
    }
}));
const deleteCartItems = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const prodcutId = req.body.productId;
    const deletedProduct = yield auth_controller_1.userSrvc.deleteCart(id, prodcutId, next);
    if (deletedProduct) {
        res.status(200).json({
            status: "OK",
            message: "Deleted successfully",
        });
    }
    else {
        next(new customerror_1.CustomeError("Something send wrong", 401));
    }
}));
const addWishList = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.body.productId;
    const userId = req.params.id;
    auth_controller_1.userSrvc.addToWishList(productId, userId, res, next);
}));
const viewWishlist = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    auth_controller_1.userSrvc.viewWishList(userId, res, next);
}));
const deleteWishlistprdct = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const prodcutId = req.body.productId;
    const deleted = yield auth_controller_1.userSrvc.deleteWishList(id, prodcutId, next);
    if (deleted) {
        res.status(200).json({
            Message: "Delted successfully"
        });
    }
    else {
        next(new customerror_1.CustomeError("Something send wrong", 401));
    }
}));
const userPayment = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield auth_controller_1.userSrvc.payment(req, res, next);
}));
const succes = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Success");
}));
const cancel = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Denied");
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
    deleteCartItems,
    addWishList,
    viewWishlist,
    deleteWishlistprdct,
    userPayment,
    succes,
    cancel,
    deleteall
};
