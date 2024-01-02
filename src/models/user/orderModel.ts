import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        require: [true, "Userid is not present"]

    },
    Products: [{
        type: mongoose.Schema.Types.ObjectId,
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
})

export const orderModel = mongoose.model('Order', orderSchema);