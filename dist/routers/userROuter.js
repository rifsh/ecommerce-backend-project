"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const auth_handler_1 = require("../handlers/auth_handler");
const product_hndler_1 = require("../handlers/product_hndler");
exports.router = express_1.default.Router();
//user_router
exports.router.route('/signup').post(auth_handler_1.signUp);
exports.router.route('/login').post(auth_handler_1.logIn);
//products_router
exports.router.route('/products').get(auth_handler_1.protectRoute, product_hndler_1.get_product).post(product_hndler_1.add_product);
exports.router.route('/products_Id/:id').get(product_hndler_1.get_product_Byid);
