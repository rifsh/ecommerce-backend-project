import mongoose from "mongoose";

interface wishlistInterface {
    userId: mongoose.Schema.Types.ObjectId,
    wishlistedproducts:[mongoose.Schema.Types.ObjectId]
}

export default wishlistInterface