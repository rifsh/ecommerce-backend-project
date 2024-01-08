import mongoose from "mongoose";
import { Users } from "./usermodel";
import { producModel } from "../productsmodel";

const orderSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        require: [true, "Userid is not present"],
        ref: Users
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please enter a valid productId'],
        ref:producModel
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
})

export const orderModel = mongoose.model('Order', orderSchema);