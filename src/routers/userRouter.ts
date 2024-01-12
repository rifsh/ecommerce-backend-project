import exp from 'express';
import { userControllers } from '../controller/user/auth_handler';
import { userRouteProtecter } from '../middleware/routeProtector';
import { userImgUpload } from '../middleware/imageUpload';



export const userRouter = exp.Router();
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
userRouter.post('/signup', userImgUpload, (userControllers.signUp))
    .post('/login', userControllers.logIn)
    .get('/success', userControllers.succes)
    .get('/cancel', userControllers.cancel)
    .get('/products', userControllers.viewProduct)
    .get('/:id/category', userControllers.categorizedProducts)
    .get('/products_Id/:id', userControllers.productById)

    .use(userRouteProtecter)
    .post('/:id/cart', userControllers.addToCart)
    .get('/:id/cart', userControllers.viewCart)
    .post('/:id/deletecart', userControllers.deleteCartItems)
    .post('/:id/wishlist', userControllers.addWishList)
    .get('/:id/wishlist', userControllers.viewWishlist)
    .post('/:id/deletewishlist', userControllers.deleteWishlistprdct)
    .post('/:id/payment', userControllers.userPayment)
// products_router
