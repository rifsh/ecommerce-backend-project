"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_handler_1 = require("../handlers/admin/auth-handler");
const imageUpload_1 = require("../middleware/imageUpload");
const routeProtector_1 = require("../middleware/routeProtector");
exports.adminRouter = express_1.default.Router();
//admin_router
exports.adminRouter.route('/login').post(auth_handler_1.adminController.login);
exports.adminRouter.route('/users').get(routeProtector_1.adminRouteProtecter, auth_handler_1.adminController.users);
exports.adminRouter.route('/user/:id').get(routeProtector_1.adminRouteProtecter, auth_handler_1.adminController.userById);
exports.adminRouter.route('/addproducts').post(routeProtector_1.adminRouteProtecter, imageUpload_1.imgUpload, auth_handler_1.adminController.addProduct);
exports.adminRouter.route('/updateproduct/:id').patch(routeProtector_1.adminRouteProtecter, imageUpload_1.imgUpload, auth_handler_1.adminController.updateProduct);
exports.adminRouter.route('/deleteproduct/:id').delete(routeProtector_1.adminRouteProtecter, auth_handler_1.adminController.deleteProduct);
