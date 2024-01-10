"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.producModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
function required(result) {
    return `${result} is a required field`;
}
const productSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, required('Title')],
        unique: true
    },
    description: {
        type: String,
        required: [true, required('Description')]
    },
    price: {
        type: Number,
        required: [true, required('Price')]
    },
    image: {
        type: String,
        required: [true, required('Image')]
    },
    author: {
        type: String,
        required: [true, required('Author')]
    },
    category: {
        type: String,
        required: [true, required('Category')]
    }
});
exports.producModel = mongoose_1.default.model('productdetail', productSchema);
