"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
function connection() {
    mongoose_1.default.connect('mongodb+srv://rifshmuhammed:1cijhAanIjgYUcvL@cluster0.9ik2otk.mongodb.net/users?retryWrites=true&w=majority', {
    // dbName:'usermodels'
    })
        .then((conn) => {
        console.log('connected successfully');
    }).catch((err) => {
        console.log(err.message);
    });
}
exports.connection = connection;
