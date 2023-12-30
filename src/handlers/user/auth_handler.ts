import { NextFunction, Request, Response, request } from 'express';
import * as dotenv from 'dotenv';
import path from 'path'
import { Users } from '../../models/user/usermodel';
import catchAsync from '../../utils/asyncHandler';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken'
import { customeError } from '../../utils/customerror';
import tokenInterface from '../../models/interfaces/user_interfaces/tokeninterface';
import { userSrvc } from '../../services/user/auth-controller';

dotenv.config({ path: path.join(__dirname, '../../config.env') });

const signUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await userSrvc.signUp(req, res, next);
    const token = userSrvc.userToken();
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
const protectRoute = catchAsync(async (req: Request, res: Response, next) => {
   userSrvc.routeProtecter(req, res, next);
   
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
const addToOrder = catchAsync(async (req: Request, res: Response, next) => {
    userSrvc.addToOrder(req, res, next)
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
    protectRoute,
    addToOrder
} 