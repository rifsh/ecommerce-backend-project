"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_handler_1 = require("../controller/admin/auth-handler");
const imageUpload_1 = require("../middleware/imageUpload");
const routeProtector_1 = require("../middleware/routeProtector");
exports.adminRouter = express_1.default.Router();
// adminRouter.route('/login').post(adminController.login);
// adminRouter.route('/users').get(adminRouteProtecter,adminController.users);
// adminRouter.route('/user/:id').get(adminRouteProtecter,adminController.userById);
// adminRouter.route('/addproducts').post(adminRouteProtecter,imgUpload,adminController.addProduct);
// adminRouter.route('/updateproduct/:id').patch(adminRouteProtecter,imgUpload,adminController.updateProduct);
// adminRouter.route('/deleteproduct/:id').delete(adminRouteProtecter,adminController.deleteProduct);
//admin_router
exports.adminRouter.post('/login', auth_handler_1.adminController.login)
    .use(routeProtector_1.adminRouteProtecter)
    .get('/users', auth_handler_1.adminController.users)
    .get('/user/:id', auth_handler_1.adminController.userById)
    .get('/products', auth_handler_1.adminController.viewProducts)
    .get('/productbyid/:id', auth_handler_1.adminController.singleProduct)
    .post('/addproducts', imageUpload_1.imgUpload, auth_handler_1.adminController.addProduct)
    .patch('/updateproduct/:id', imageUpload_1.imgUpload, auth_handler_1.adminController.updateProduct)
    .delete('/deleteproduct/:id', auth_handler_1.adminController.deleteProduct);
