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
exports.adminController = void 0;
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const auth_controller_1 = require("../../services/admin/auth-controller");
const login = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield auth_controller_1.admin_srvc.login(req, res, next);
    res.status(200).json({
        status: "Success",
        name: process.env.ADMIN_USRNAME,
        message: "Sir you are successfully logged in",
        token: response
    });
}));
const users = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield auth_controller_1.admin_srvc.userFinding(req, res, next);
    res.status(200).json({
        totalUsers: users.length,
        datas: users
    });
}));
const userById = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_controller_1.admin_srvc.userById(req, res, next);
    res.status(200).json({
        status: 'success',
        message: 'Successfully fetched user data.',
        data: user
    });
}));
const viewProducts = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const prdcts = yield auth_controller_1.admin_srvc.allProducts();
    if (!prdcts) {
        res.status(200).json({
            Message: "Empty"
        });
    }
    res.status(200).json({
        totalProducts: prdcts.length,
        datas: prdcts
    });
}));
const singleProduct = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    const products = yield auth_controller_1.admin_srvc.productsById(productId);
    res.status(200).json({
        datas: products
    });
}));
const addProduct = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = req.body;
    console.log(product);
    const products = yield auth_controller_1.admin_srvc.addproduts(product);
    res.status(201).json({
        status: 'success',
        message: 'Successfully created a product.',
        products: products
    });
}));
const updateProduct = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = req.body;
    const prdctId = req.params.id;
    const id = yield auth_controller_1.admin_srvc.updateProducts(prdctId, products, next);
    res.json({
        status: 'success',
        message: `Successfully updated a product with id '${id}'`,
    });
}));
const deleteProduct = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield auth_controller_1.admin_srvc.deleteProduct(req, res, next);
}));
exports.adminController = {
    login,
    users,
    userById,
    viewProducts,
    singleProduct,
    addProduct,
    updateProduct,
    deleteProduct
};
