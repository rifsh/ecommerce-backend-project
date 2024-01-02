"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const usermodel_1 = require("./usermodel");
const productsmodel_1 = require("../productsmodel");
const cartSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: usermodel_1.Users
    },
    products: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: [true, 'Please enter a valid productId'],
            ref: productsmodel_1.producModel
        }]
});
exports.CartModel = mongoose_1.default.model('cart', cartSchema);
