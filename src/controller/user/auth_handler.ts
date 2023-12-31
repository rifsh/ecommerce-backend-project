import { NextFunction, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import path from 'path'
import catchAsync from '../../utils/asyncHandler';
import { userSrvc } from '../../services/user/auth-controller';
import { userToken } from '../../utils/token';
import { orderModel } from '../../models/user/orderModel';
import { ObjectId } from 'mongoose';
import { CustomeError } from '../../utils/customerror';
import { Usersignup } from '../../interfaces/user/userSignup';

dotenv.config({ path: path.join(__dirname, '../../config.env') });

const signUp = catchAsync(async (req: Request, res: Response) => {
    const userDatas:Usersignup = req.body;
    const users = await userSrvc.signUp(userDatas);
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
    const userName: string = req.body.username;
    const password: string = req.body.password;
    const logedValue = await userSrvc.logIn(userName, password, next);
    res.status(200).json({
        status: "Valid",
        token: logedValue
    })

})
const viewProduct = catchAsync(async (req: Request, res: Response) => {
    const products = await userSrvc.products();
    res.status(200).json({
        status: "OK",
        total_Products: products.length,
        datas: {
            products
        }
    })

})
const categorizedProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const category: string = req.params.id
    const products = await userSrvc.productByCategory(category, next);
    res.status(200).json({
        totalPrdoucts: products.length,
        products
    })

})
const productById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const productID: string = req.params.id;
    await userSrvc.productById(productID, next)
})
const addToCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const productId: ObjectId = req.body.productId;
    const userId: string = req.params.id;
    userSrvc.addToCart(req, res, next)
})
const viewCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId: string = req.params.id
    const carts = await userSrvc.viewCart(userId);
    if (carts) {
        res.status(200).json({
            carts
        })
    } else {
        next(new CustomeError("Cart is not found", 404));
    }
})
const addWishList = catchAsync(async (req: Request, res: Response, next) => {
    userSrvc.addToWishList(req, res, next)
})
const viewWishlist = catchAsync(async (req: Request, res: Response, next) => {
    userSrvc.viewWishList(req, res, next)
})
const deleteWishlistprdct = catchAsync(async (req: Request, res: Response, next) => {
    const id: string = req.params.id;
    const prodcutId:ObjectId = req.body.productId;
        const deleted = await userSrvc.deleteWishList(id, prodcutId, next);
        if (deleted) {
            res.status(200).json({
                Message:"Delted successfully"
            })
        }else{
            next(new CustomeError("Something send wrong",401));
        }
})
const userPayment = catchAsync(async (req: Request, res: Response, next) => {
    const payment = await userSrvc.payment(req, res, next);
})
const succes = catchAsync(async (req: Request, res: Response, next) => {
    res.send("Success");
})
const cancel = catchAsync(async (req: Request, res: Response, next) => {
    res.send("Denied");
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
    succes,
    cancel,
    deleteall
} 