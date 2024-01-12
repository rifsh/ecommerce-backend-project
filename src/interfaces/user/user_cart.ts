import mongoose from "mongoose";

interface userCartInterface {
    userId: mongoose.Schema.Types.ObjectId,
    products:[mongoose.Schema.Types.ObjectId],
    totalPrice:number
}

export default userCartInterface