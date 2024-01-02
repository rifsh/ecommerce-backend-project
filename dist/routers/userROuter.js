"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_handler_1 = require("../handlers/user/auth_handler");
const routeProtector_1 = require("../middleware/routeProtector");
exports.userRouter = express_1.default.Router();
//user_router
exports.userRouter.route('/signup').post(auth_handler_1.userControllers.signUp);
exports.userRouter.route('/login').post(auth_handler_1.userControllers.logIn);
exports.userRouter.route('/:id/cart').post(auth_handler_1.userControllers.addToCart);
exports.userRouter.route('/:id/cart').get(auth_handler_1.userControllers.viewCart);
exports.userRouter.route('/:id/wishlist').post(auth_handler_1.userControllers.addWishList);
exports.userRouter.route('/:id/wishlist').get(auth_handler_1.userControllers.viewWishlist);
exports.userRouter.route('/:id/deletewishlist').post(auth_handler_1.userControllers.deleteWishlistprdct);
exports.userRouter.route('/:id/addtoorder').post(auth_handler_1.userControllers.addToOrder);
exports.userRouter.route('/addtoorder').get(auth_handler_1.userControllers.deleteall);
//products_router
exports.userRouter.route('/products').get(routeProtector_1.userRouteProtecter, auth_handler_1.userControllers.viewProduct);
exports.userRouter.route('/:id/category').get(auth_handler_1.userControllers.categorizedProducts);
exports.userRouter.route('/products_Id/:id').get(auth_handler_1.userControllers.productById);
