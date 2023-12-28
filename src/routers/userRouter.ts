import exp from 'express';
import {userControllers} from '../handlers/auth_handler';
import {add_product, get_product, get_product_Byid, productCategory} from '../handlers/product_hndler';



export const router = exp.Router();

//user_router
router.route('/signup').post(userControllers.signUp);
router.route('/login').post(userControllers.logIn);
router.route('/:id/cart').post(userControllers.addToCart);
router.route('/:id/cart').get(userControllers.viewCart);
router.route('/:id/wishlist').post(userControllers.addWishList);
router.route('/:id/wishlist').get(userControllers.viewWishlist);
router.route('/:id/deletewishlist').post(userControllers.deleteWishlistprdct);

//products_router
router.route('/products').get(userControllers.protectRoute,get_product).post(add_product);
router.route('/:id/category').get(productCategory);
router.route('/products_Id/:id').get(userControllers.protectRoute,get_product_Byid);
