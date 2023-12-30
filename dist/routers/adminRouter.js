"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_handler_1 = require("../handlers/admin/auth-handler");
exports.adminRouter = express_1.default.Router();
//admin_router
exports.adminRouter.route('/loginadmin').post(auth_handler_1.adminController.login);
exports.adminRouter.route('/users').get(auth_handler_1.adminController.users);
exports.adminRouter.route('/user/:id').get(auth_handler_1.adminController.userById);
exports.adminRouter.route('/addproducts').post(auth_handler_1.adminController.addProduct);
exports.adminRouter.route('/updateproduct/:id').patch(auth_handler_1.adminController.updateProduct);
exports.adminRouter.route('/deleteproduct/:id').delete(auth_handler_1.adminController.deleteProduct);
