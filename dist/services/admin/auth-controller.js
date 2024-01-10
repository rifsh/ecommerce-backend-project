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
exports.admin_srvc = void 0;
const path_1 = __importDefault(require("path"));
const token_1 = require("../../utils/token");
const dotenv_1 = __importDefault(require("dotenv"));
const customerror_1 = require("../../utils/customerror");
const usermodel_1 = require("../../models/user/usermodel");
const productsmodel_1 = require("../../models/productsmodel");
const login_1 = require("../../models/admin/login");
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../../../config.env') });
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reqAdminName = req.body.username;
    const reqAdminPassword = req.body.password;
    const adminName = process.env.ADMIN_USRNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const validation = reqAdminName === adminName && reqAdminPassword === adminPassword;
    if (!validation) {
        return next(new customerror_1.CustomeError('User name or password is incorrecct', 404));
    }
    else {
        yield login_1.adminModel.create({ adminName: reqAdminName, adminPassword: reqAdminPassword });
        const tokens = (0, token_1.adminToken)(adminName);
        return tokens;
    }
});
const userFinding = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield usermodel_1.Users.find();
    if (!users || users.length === 0) {
        next(new customerror_1.CustomeError("Users not found in the data base!!!", 404));
    }
    else {
        return users;
    }
});
const userById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const usrId = req.params.id;
    const users = yield usermodel_1.Users.findById(usrId);
    if (!users) {
        next(new customerror_1.CustomeError(`User is not present in the database with id '${usrId}' `, 404));
    }
    else {
        return users;
    }
});
const allProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield productsmodel_1.producModel.find();
});
const productsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return productsmodel_1.producModel.findById(id);
});
const addproduts = (product) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(product);
    const createdProduct = yield productsmodel_1.producModel.create(product);
    return createdProduct;
});
const updateProducts = (id, prodcut, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield productsmodel_1.producModel.findById(id);
    if (!product) {
        next(new customerror_1.CustomeError(`No such product found with id ${id}`, 404));
    }
    else {
        const updateProduct = yield product.updateOne(prodcut);
        product.save();
        return id;
    }
});
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const product = yield productsmodel_1.producModel.findById(id);
    if (!product) {
        next(new customerror_1.CustomeError(`Product not found with id${id}`, 404));
    }
    else {
        const deletedPrdct = yield productsmodel_1.producModel.findOneAndDelete({ _id: id });
        res.json({
            status: 'success',
            message: `Successfully deleted a product with id '${id}'`,
        });
    }
    return product;
});
exports.admin_srvc = {
    login,
    token: token_1.adminToken,
    userFinding,
    userById,
    allProducts,
    productsById,
    addproduts,
    updateProducts,
    deleteProduct
};
