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
exports.get_product_Byid = exports.productCategory = exports.get_product = exports.add_product = void 0;
const productsmodel_1 = require("../models/productsmodel");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const auth_controller_1 = require("../services/user/auth-controller");
exports.add_product = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const addedProducts = [];
    addedProducts.push(yield productsmodel_1.producModel.create(req.body));
    res.status(200).json({
        status: 'OK',
        datas: {
            products: addedProducts
        }
    });
}));
exports.get_product = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    auth_controller_1.userSrvc.products(req, res, next);
}));
exports.productCategory = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield auth_controller_1.userSrvc.productByCategory(req, res, next);
    res.status(200).json({
        products
    });
}));
exports.get_product_Byid = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    auth_controller_1.userSrvc.productById(req, res, next);
}));
