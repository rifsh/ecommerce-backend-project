import { NextFunction, Request, Response, request } from 'express';
import * as dotenv from 'dotenv';
import path from 'path'
import catchAsync from '../../utils/asyncHandler';
import { userSrvc } from '../../services/user/auth-controller';
import { userToken } from '../../utils/token';
import { orderModel } from '../../models/user/orderModel';

dotenv.config({ path: path.join(__dirname, '../../config.env') });

const signUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await userSrvc.signUp(req, res, next);
    const token = userToken();
    res.status(200).json({
        status: "Success",
        token,
        data: {
            users
        }
    })

})
const logIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const logedValue = await userSrvc.logIn(req, res, next);

})
const viewProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const products = await userSrvc.products(req, res,next);
    res.status(200).json({
        status: "OK",
        total_Products: products.length,
        datas: {
            products
        }
    })
    
})
const categorizedProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const products = await userSrvc.productByCategory(req, res, next);
})
const productById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await userSrvc.productById(req, res, next)
})
const addToCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    userSrvc.addToCart(req, res, next)
})
const viewCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    userSrvc.viewCart(req, res, next)
})
const addWishList = catchAsync(async (req: Request, res: Response, next) => {
    userSrvc.addToWishList(req, res, next)
})
const viewWishlist = catchAsync(async (req: Request, res: Response, next) => {
    userSrvc.viewWishList(req, res, next)
})
const deleteWishlistprdct = catchAsync(async (req: Request, res: Response, next) => {
    userSrvc.deleteWishList(req, res, next)
})
const userPayment  = catchAsync(async (req: Request, res: Response, next) => {
    const payment = await userSrvc.payment(req, res, next);
})
const addToOrder = catchAsync(async (req: Request, res: Response, next) => {
    userSrvc.addToOrder(req, res, next)
})
const deleteall = catchAsync(async (req: Request, res: Response, next) => {
    await orderModel.deleteMany();
})






export const userControllers = {
    signUp,
    logIn,
    viewProduct,
    categorizedProducts,
    productById,
    addToCart,
    viewCart,
    addWishList,
    viewWishlist,
    deleteWishlistprdct,
    userPayment,
    addToOrder,
    deleteall
} 