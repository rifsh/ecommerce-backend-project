import mongoose from 'mongoose';
import userCartInterface from '../interfaces/user_interfaces/user_cart';

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please enter a valid productId']
    }]

})

export const CartModel = mongoose.model<userCartInterface>('cart', cartSchema);