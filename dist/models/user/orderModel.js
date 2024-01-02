"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    userid: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        require: [true, "Userid is not present"]
    },
    Products: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            require: [true, "Product is not present"]
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
