"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_handler_1 = require("../controller/user/auth_handler");
const routeProtector_1 = require("../middleware/routeProtector");
const imageUpload_1 = require("../middleware/imageUpload");
exports.userRouter = express_1.default.Router();
// userRouter.route('/signup').post(userImgUpload, userControllers.signUp);
// userRouter.route('/login').post(userControllers.logIn);
// userRouter.route('/:id/cart').post(userControllers.addToCart);
// userRouter.route('/:id/cart').get(userControllers.viewCart);
// userRouter.route('/:id/wishlist').post(userControllers.addWishList);
// userRouter.route('/:id/wishlist').get(userControllers.viewWishlist);
// userRouter.route('/:id/deletewishlist').post(userControllers.deleteWishlistprdct);
// userRouter.route('/:id/payment').post(userRouteProtecter,userControllers.userPayment);
// userRouter.route('/success').get(userControllers.succes);
// userRouter.route('/:id/addtoorder').post(userControllers.addToOrder);
// userRouter.route('/addtoorder').get(userControllers.deleteall);
// userRouter.route('/products').get(userRouteProtecter, userControllers.viewProduct);
// userRouter.route('/:id/category').get(userControllers.categorizedProducts);
// userRouter.route('/products_Id/:id').get(userControllers.productById);
//user_router
exports.userRouter.post('/signup', imageUpload_1.userImgUpload, (auth_handler_1.userControllers.signUp))
    .post('/login', auth_handler_1.userControllers.logIn)
    .get('/success', auth_handler_1.userControllers.succes)
    .get('/cancel', auth_handler_1.userControllers.cancel)
    .get('/products', auth_handler_1.userControllers.viewProduct)
    .get('/:id/category', auth_handler_1.userControllers.categorizedProducts)
    .get('/products_Id/:id', auth_handler_1.userControllers.productById)
    .use(routeProtector_1.userRouteProtecter)
    .post('/:id/cart', auth_handler_1.userControllers.addToCart)
    .get('/:id/cart', auth_handler_1.userControllers.viewCart)
    .post('/:id/deletecart', auth_handler_1.userControllers.deleteCartItems)
    .post('/:id/wishlist', auth_handler_1.userControllers.addWishList)
    .get('/:id/wishlist', auth_handler_1.userControllers.viewWishlist)
    .post('/:id/deletewishlist', auth_handler_1.userControllers.deleteWishlistprdct)
    .post('/:id/payment', auth_handler_1.userControllers.userPayment);
// products_router
