"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cartSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId
    },
    products: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: [true, 'Please enter a valid productId']
        }]
});
exports.CartModel = mongoose_1.default.model('cart', cartSchema);
