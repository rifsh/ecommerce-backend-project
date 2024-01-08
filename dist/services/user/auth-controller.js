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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSrvc = void 0;
const usermodel_1 = require("../../models/user/usermodel");
const token_1 = require("../../utils/token");
const customerror_1 = require("../../utils/customerror");
const productsmodel_1 = require("../../models/productsmodel");
const cartModel_1 = require("../../models/user/cartModel");
const wishlistModel_1 = require("../../models/user/wishlistModel");
const payment_1 = require("../../middleware/payment");
//JWT_token
const signUp = (userDatas) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield usermodel_1.Users.create(userDatas);
    return newUser;
});
const logIn = (usrname, password, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!usrname || !password) {
        const err = new customerror_1.CustomeError(`Please provide a Username and password`, 404);
        next(err);
    }
    const logedUser = yield usermodel_1.Users.findOne({ usrname }).select('+password');
    if (!logedUser || !(yield logedUser.comparePassword(password, logedUser.password))) {
        const error = new customerror_1.CustomeError('Incorrect username or password', 404);
        next(error);
    }
    const token = (0, token_1.userToken)(logedUser._id);
    return token;
});
const products = () => __awaiter(void 0, void 0, void 0, function* () {
    let products = [];
    products = yield productsmodel_1.producModel.find({});
    return products;
});
const productByCategory = (category, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categorizedProduts = yield productsmodel_1.producModel.find({ category: category });
    if (categorizedProduts.length === 0) {
        next(new customerror_1.CustomeError(`Product not found with the category '${category}'`, 404));
    }
    else {
        return categorizedProduts;
    }
});
const productById = (productId, next) => __awaiter(void 0, void 0, void 0, function* () {
    let products = [];
    products = yield productsmodel_1.producModel.findById(productId);
    if (!products) {
        next(new customerror_1.CustomeError(`Product not found eith given Id '${productId}'!!`, 404));
    }
    else {
        return products;
    }
});
const addToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.body.productId;
    const userId = req.params.id;
    const userFinding = yield usermodel_1.Users.findById(userId);
    const product = yield productsmodel_1.producModel.findById(productId);
    const existingUser = yield cartModel_1.CartModel.findOne({ userId: userId });
    const existingProduct = yield cartModel_1.CartModel.findOne({ userId: userId, products: productId });
    if (!product || !userFinding) {
        next(new customerror_1.CustomeError("Product or User not found in the db", 404));
    }
    else {
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
            next(new customerror_1.CustomeError('product is already in cart', 404));
        }
    }
});
const viewCart = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const viewCart = yield cartModel_1.CartModel.findOne({ userId: userId });
    return viewCart;
});
const addToWishList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        next(new customerror_1.CustomeError('product is already in Wishlist', 404));
    }
});
const viewWishList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const wishlist = yield wishlistModel_1.wishListModel.findOne({ userId });
    if (wishlist) {
        res.status(200).json({
            wishlist
        });
    }
    else {
        next(new customerror_1.CustomeError(`User not found with id${userId}`, 404));
    }
});
const deleteWishList = (id, prodcutId, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productFinding = yield wishlistModel_1.wishListModel.findOne({ userId: id, wishlistedproducts: prodcutId });
    const checkUser = yield wishlistModel_1.wishListModel.findOne({ userId: id });
    if (checkUser && productFinding) {
        const index = yield checkUser.wishlistedproducts.indexOf(prodcutId);
        yield checkUser.wishlistedproducts.splice(index, 1);
        yield checkUser.save();
        return checkUser;
    }
    else if (!productFinding) {
        next(new customerror_1.CustomeError(`Product not found with id ${prodcutId}`, 404));
    }
    else if (!checkUser) {
        next(new customerror_1.CustomeError(`User not found with id ${id}`, 404));
    }
});
const payment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const user = yield usermodel_1.Users.findById(userId);
    const cart = yield cartModel_1.CartModel.findOne({ userId });
    (0, payment_1.paymentMethod)(req, res, next);
});
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
    deleteWishList,
    payment,
};
