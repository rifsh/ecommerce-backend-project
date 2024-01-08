"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const usermodel_1 = require("./usermodel");
const productsmodel_1 = require("../productsmodel");
const orderSchema = new mongoose_1.default.Schema({
    userid: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        require: [true, "Userid is not present"],
        ref: usermodel_1.Users
    },
    products: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: [true, 'Please enter a valid productId'],
            ref: productsmodel_1.producModel
        }],
    purchaseDate: {
        type: Date,
        default: new Date().getDate()
    },
    orderId: {
        type: String,
        require: true
    },
    totalPrice: {
        type: Number
    },
    totalItems: {
        type: Number
    }
});
exports.orderModel = mongoose_1.default.model('Order', orderSchema);
