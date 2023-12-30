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
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const customerror_1 = require("../../../utils/customerror");
const usermodel_1 = require("../../../models/user/usermodel");
const productsmodel_1 = require("../../../models/productsmodel");
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../../../config.env') });
const token = (usrname) => {
    return jsonwebtoken_1.default.sign({ name: usrname }, process.env.jwt_string);
};
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reqAdminName = req.body.username;
    const reqAdminPassword = req.body.password;
    const adminName = process.env.ADMIN_USRNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const validation = reqAdminName === adminName && reqAdminPassword === adminPassword;
    if (!validation) {
        return next(new customerror_1.customeError('User name or password is incorrecct', 404));
    }
    else {
        const tokens = token(adminName);
        return tokens;
    }
});
const routeProtector = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let validTokens;
    const authentication = req.headers.authorization;
    if (authentication && authentication.startsWith('bearer')) {
        const sampleToken = authentication.split(' ');
        validTokens = sampleToken[1];
    }
    if (!validTokens) {
        next(new customerror_1.customeError('You are not loggedin !!!', 404));
    }
    const tokenDecode = yield jsonwebtoken_1.default.verify(validTokens, process.env.jwt_string);
    let adminName;
    for (const key in tokenDecode) {
        if (key === 'name') {
            adminName = tokenDecode[key];
        }
    }
    const tokeValidation = process.env.ADMIN_USRNAME === adminName;
    if (!tokeValidation) {
        next(new customerror_1.customeError('You are not loggedin', 404));
    }
    next();
});
const userFinding = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = usermodel_1.Users.find();
    return users;
});
const userById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const usrId = req.params.id;
    const users = usermodel_1.Users.findById(usrId);
    return users;
});
const addproduts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const enteredProduct = req.body;
    const createdProduct = yield productsmodel_1.producModel.create(enteredProduct);
    return createdProduct;
});
const updateProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const product = yield productsmodel_1.producModel.findById(id);
    if (!product) {
        next(new customerror_1.customeError(`No such product found with id ${id}`, 404));
    }
    else {
        const updateProduct = yield product.updateOne(req.body);
        product.save();
        return id;
    }
});
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const product = yield productsmodel_1.producModel.findById(id);
    if (!product) {
        next(new customerror_1.customeError(`Product not found with id${id}`, 404));
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
    token,
    routeProtector,
    userFinding,
    userById,
    addproduts,
    updateProducts,
    deleteProduct
};
