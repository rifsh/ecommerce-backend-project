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
exports.userSrvc = void 0;
const usermodel_1 = require("../../models/user/usermodel");
const asyncHandler_1 = __importDefault(require("../../utils/asyncHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const customerror_1 = require("../../utils/customerror");
const productsmodel_1 = require("../../models/productsmodel");
const cartModel_1 = require("../../models/user/cartModel");
const wishlistModel_1 = require("../../models/user/wishlistModel");
//JWT_token
let userToken = (id) => {
    return jsonwebtoken_1.default.sign({ id: id }, process.env.jwt_string, {
        expiresIn: 30000000
    });
};
const signUp = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield usermodel_1.Users.create(req.body);
    const token = userToken(newUser._id);
    res.status(200).json({
        status: "Success",
        token,
        data: {
            user: newUser
        }
    });
}));
const logIn = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const usrname = req.body.usrname;
    const password = req.body.password;
    if (!usrname || !password) {
        const err = new customerror_1.customeError(`Please provide a Username and password`, 404);
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
        // datas: {
        //     user: logedUser
        // },
    });
}));
const products = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let products = [];
    products = yield productsmodel_1.producModel.find({});
    res.status(200).json({
        status: "OK",
        total_Products: products.length,
        datas: {
            products
        }
    });
}));
const productByCategory = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const category = req.params.id;
    const categorizedProduts = yield productsmodel_1.producModel.findOne({ category: category });
    console.log(categorizedProduts);
}));
const productById = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let products = [];
    products = yield productsmodel_1.producModel.findById(req.params.id);
    res.status(200).json({
        status: "OK",
        total_Products: products.length,
        datas: {
            products
        }
    });
}));
const addToCart = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.body.productId;
    const userId = req.params.id;
    const product = yield productsmodel_1.producModel.findById(productId);
    const existingUser = yield cartModel_1.CartModel.findOne({ userId: userId });
    const existingProduct = yield cartModel_1.CartModel.findOne({ userId: userId, products: productId });
    if (existingUser && !existingProduct) {
        existingUser.products.push(productId);
        yield existingUser.save();
        res.status(200).json({
            status: "Success",
            message: "Your product is added to cart"
        });
    }
    else if (!existingUser) {
        //New user
        const addingCart = yield cartModel_1.CartModel.create({ userId: userId, products: [productId] });
        res.status(200).json({
            status: "Success",
            message: "Your product is added to cart"
        });
    }
    else if (existingProduct) {
        next(new customerror_1.customeError('product is already in cart', 404));
    }
}));
const viewCart = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const viewCart = yield cartModel_1.CartModel.findOne({ userId: req.params.id });
    // const products = await producModel.findById(viewCart.products);
    console.log(viewCart);
    res.status(200).json({
        status: "OK",
        datas: {
            products: viewCart
        }
    });
}));
const addToWishList = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.body.productId;
    const userId = req.params.id;
    const prodcut = yield productsmodel_1.producModel.findById(productId);
    const existingUser = yield wishlistModel_1.wishListModel.findOne({ userId: userId });
    const existingProduct = yield wishlistModel_1.wishListModel.findOne({ userId: userId, wishlistedproducts: productId });
    if (existingUser && !existingProduct) {
        existingUser.wishlistedproducts.push(productId);
        yield existingUser.save();
        res.status(200).json({
            status: "Success",
            message: "Your product is added to Wishlist"
        });
    }
    else if (!existingUser) {
        //New user
        const addingCart = yield wishlistModel_1.wishListModel.create({ userId: userId, wishlistedproducts: [productId] });
        res.status(200).json({
            status: "Success",
            message: "Your product is added to Wishlist"
        });
    }
    else if (existingProduct) {
        next(new customerror_1.customeError('product is already in Wishlist', 404));
    }
}));
const viewWishList = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const wishlist = yield wishlistModel_1.wishListModel.findOne({ userId });
    if (wishlist) {
        res.status(200).json({
            wishlist
        });
    }
    else {
        next(new customerror_1.customeError(`User not found with id${userId}`, 404));
    }
}));
const deleteWishList = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const prodcutId = req.body.productId;
    const productFinding = yield wishlistModel_1.wishListModel.findOne({ userId: id, wishlistedproducts: prodcutId });
    const checkUser = yield wishlistModel_1.wishListModel.findOne({ userId: id });
    if (checkUser && productFinding) {
        const index = yield checkUser.wishlistedproducts.indexOf(prodcutId);
        yield checkUser.wishlistedproducts.splice(index, 1);
        yield checkUser.save();
        res.status(200).json({
            status: "Success"
        });
    }
    else if (!productFinding) {
        next(new customerror_1.customeError(`Product not found with id ${prodcutId}`, 404));
    }
    else if (!checkUser) {
        next(new customerror_1.customeError(`User not found with id ${id}`, 404));
    }
}));
exports.userSrvc = {
    signUp,
    logIn,
    products,
    productByCategory,
    productById,
    addToCart,
    viewCart,
    addToWishList,
    viewWishList,
    deleteWishList
};
