"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishListModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const wishListSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId
    },
    wishlistedproducts: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: [true, 'Please enter a valid productId']
        }],
    totalPrice: Number
});
exports.wishListModel = mongoose_1.default.model('wishlist', wishListSchema);
