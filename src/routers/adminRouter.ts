import exp from 'express';
import { adminController } from '../controller/admin/auth-handler';
import { imgUpload } from '../middleware/imageUpload';
import { adminRouteProtecter } from '../middleware/routeProtector';



export const adminRouter = exp.Router();

// adminRouter.route('/login').post(adminController.login);
// adminRouter.route('/users').get(adminRouteProtecter,adminController.users);
// adminRouter.route('/user/:id').get(adminRouteProtecter,adminController.userById);
// adminRouter.route('/addproducts').post(adminRouteProtecter,imgUpload,adminController.addProduct);
// adminRouter.route('/updateproduct/:id').patch(adminRouteProtecter,imgUpload,adminController.updateProduct);
// adminRouter.route('/deleteproduct/:id').delete(adminRouteProtecter,adminController.deleteProduct);

//admin_router
adminRouter.post('/login', adminController.login)
    .use(adminRouteProtecter)
    .get('/users', adminController.users)
    .get('/user/:id', adminController.userById)
    .get('/products', adminController.viewProducts)
    .get('/productbyid/:id',adminController.singleProduct)
    .post('/addproducts', imgUpload, adminController.addProduct)
    .patch('/updateproduct/:id', imgUpload, adminController.updateProduct)
    .delete('/deleteproduct/:id', adminController.deleteProduct)

