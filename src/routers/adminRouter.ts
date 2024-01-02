import exp from 'express';
import { adminController } from '../handlers/admin/auth-handler';
import { imgUpload } from '../middleware/imageUpload';
import { adminRouteProtecter } from '../middleware/routeProtector';



export const adminRouter = exp.Router();

//admin_router
adminRouter.route('/login').post(adminController.login);
adminRouter.route('/users').get(adminRouteProtecter,adminController.users);
adminRouter.route('/user/:id').get(adminRouteProtecter,adminController.userById);
adminRouter.route('/addproducts').post(adminRouteProtecter,imgUpload,adminController.addProduct);
adminRouter.route('/updateproduct/:id').patch(adminRouteProtecter,imgUpload,adminController.updateProduct);
adminRouter.route('/deleteproduct/:id').delete(adminRouteProtecter,adminController.deleteProduct);

