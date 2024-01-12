import mongoose from 'mongoose';
import wishlistInterface from '../../interfaces/user/wishlist_model';

const wishListSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    wishlistedproducts: [{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please enter a valid productId']
    }],
    totalPrice: Number

})

export const wishListModel = mongoose.model<wishlistInterface>('wishlist', wishListSchema);