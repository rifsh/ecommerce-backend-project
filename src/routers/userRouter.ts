import exp from 'express';
import {userControllers} from '../handlers/user/auth_handler';



export const userRouter = exp.Router();

//user_router
userRouter.route('/signup').post(userControllers.signUp);
userRouter.route('/login').post(userControllers.logIn);
userRouter.route('/:id/cart').post(userControllers.addToCart);
userRouter.route('/:id/cart').get(userControllers.viewCart);
userRouter.route('/:id/wishlist').post(userControllers.addWishList);
userRouter.route('/:id/wishlist').get(userControllers.viewWishlist);
userRouter.route('/:id/deletewishlist').post(userControllers.deleteWishlistprdct);
userRouter.route('/:id/addtoorder').post(userControllers.addToOrder);

//products_router
userRouter.route('/products').get(userControllers.protectRoute,userControllers.viewProduct);
userRouter.route('/:id/category').get(userControllers.categorizedProducts);
userRouter.route('/products_Id/:id').get(userControllers.productById);
