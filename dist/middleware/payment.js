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
exports.paymentMethod = void 0;
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const usermodel_1 = require("../models/user/usermodel");
const cartModel_1 = require("../models/user/cartModel");
const productsmodel_1 = require("../models/productsmodel");
const customerror_1 = require("../utils/customerror");
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../config.env') });
exports.paymentMethod = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const userDetails = yield usermodel_1.Users.findById(userId);
    const CartProducts = yield cartModel_1.CartModel.findOne({ userId });
    const prdcts = yield productsmodel_1.producModel.find({ _id: CartProducts.products });
    const prdctId = prdcts.map((x) => { return x._id; });
    if (!userId || !prdcts || !CartProducts) {
        return next(new customerror_1.CustomeError('User is not found', 404));
    }
    const stripe = new stripe_1.default(process.env.STRIPE_KEY);
    // const paymentDetails = stripe.customers.create({
    //     name: userDetails.name,
    //     email: userDetails.email,
    //     address: {
    //         line1:"jahfar123",
    //         line2:"j123",
    //         country: "india",
    //         city:"Vengara",
    //         state:"Kerala",
    //         postal_code:'676508'
    //     }
    // })
    const mainStripe = yield stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: prdcts.map((v) => {
            const items = v;
            return {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: items.title,
                    },
                    unit_amount: items.price * 100
                },
                quantity: 1
            };
        }),
        success_url: 'http://localhost:3000/api/users/success',
        cancel_url: 'http://localhost:3000/api/users/cancel'
    });
    if (!mainStripe) {
        return next(new customerror_1.CustomeError('Error occured on  Session side', 404));
    }
    res.status(200).json({
        status: "OK",
        link: mainStripe.url
    });
    // const order = new orderModel({
    //     userid: userId,
    //     products: prdcts,
    //     totalItems:prdcts.length,
    //     orderId: mainStripe.id
    // })
    // order.save();
}));
