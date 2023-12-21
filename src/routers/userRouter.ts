import exp from 'express';
import {signUp, logIn, protectRoute} from '../handlers/auth_handler';
import {add_product, get_product, get_product_Byid} from '../handlers/product_hndler';



export const router = exp.Router();

//user_router
router.route('/signup').post(signUp);
router.route('/login').post(logIn);

//products_router
router.route('/products').get(protectRoute,get_product).post(add_product);
router.route('/products_Id/:id').get(get_product_Byid)
