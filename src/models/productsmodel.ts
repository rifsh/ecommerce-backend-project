import mongoose from "mongoose";

function required(result: string): string {
    return `${result} is a required field`
}

const productSchema = new mongoose.Schema<Product>({
    title:{
        type: String,
        required: [true, required('Title')],
        unique: true
    },
    description:{
        type: String,
        required: [true, required('Description')]
    },
    price:{
        type: Number,
        required: [true, required('Price')]
    },
    image:{
        type: String,
        required: [true, required('Image')]
    },
    author:{
        type: String,
        required: [true, required('Author')]
    },
    category:{
        type: String,
        required: [true, required('Category')]
    }
})

export const producModel = mongoose.model('productdetail', productSchema);