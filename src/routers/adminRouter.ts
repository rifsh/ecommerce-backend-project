import exp from 'express';
import { adminController } from '../handlers/admin/auth-handler';



export const adminRouter = exp.Router();

//admin_router
adminRouter.route('/loginadmin').post(adminController.login);
adminRouter.route('/users').get(adminController.users);
adminRouter.route('/user/:id').get(adminController.userById);
adminRouter.route('/addproducts').post(adminController.addProduct);
adminRouter.route('/updateproduct/:id').patch(adminController.updateProduct);
adminRouter.route('/deleteproduct/:id').delete(adminController.deleteProduct);

