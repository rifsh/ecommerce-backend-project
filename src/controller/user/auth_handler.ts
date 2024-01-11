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
import { Users } from '../../models/user/usermodel';

dotenv.config({ path: path.join(__dirname, '../../config.env') });

const signUp = catchAsync(async (req: Request, res: Response) => {
    const userDatas: Usersignup = req.body;
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
    const userDetails = await Users.findOne({ usrname: userName });
    const logedValue = await userSrvc.logIn(userName, password, next);
    res.status(200).json({
        status: "Valid",
        token: logedValue,
        user: userDetails
    })

})
const viewProduct = catchAsync(async (req: Request, res: Response) => {
    const products = await userSrvc.products();
    res.status(200).json({
        status: "OK",
        total_Products: products.length,
        datas: products
    })

})
const categorizedProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const category: string = req.params.id
    const products = await userSrvc.productByCategory(category, next);
    res.status(200).json({
        totalPrdoucts: products.length,
        datas: products
    })

})
const productById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const productID: string = req.params.id;
    const products = await userSrvc.productById(productID, next);
    res.status(200).json({
        id: productID,
        datas: products
    })
})
const addToCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const productId: ObjectId = req.body.productId;
    const userId: string = req.params.id;
    userSrvc.addToCart(productId, userId, res, next)
})
const viewCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId: string = req.params.id
    const carts = await userSrvc.viewCart(userId);

    if (carts) {
        res.status(200).json({
            totalProducts: carts.length,
            datas: carts
        })
    } else {
        next(new CustomeError("Cart is not found", 404));
    }
})
const deleteCartItems = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const prodcutId: ObjectId = req.body.productId;
    const deletedProduct = await userSrvc.deleteCart(id, prodcutId, next);
    if (deletedProduct) {
        res.status(200).json({
            status: "OK",
            message: "Deleted successfully",

        })
    } else {
        next(new CustomeError("Something send wrong", 401));
    }
})
const addWishList = catchAsync(async (req: Request, res: Response, next) => {
    const productId: ObjectId = req.body.productId;
    const userId: string = req.params.id;
    userSrvc.addToWishList(productId, userId, res, next)
})
const viewWishlist = catchAsync(async (req: Request, res: Response, next) => {
    const userId: string = req.params.id;
    userSrvc.viewWishList(userId, res, next)
})
const deleteWishlistprdct = catchAsync(async (req: Request, res: Response, next) => {
    const id: string = req.params.id;
    const prodcutId: ObjectId = req.body.productId;
    const deleted = await userSrvc.deleteWishList(id, prodcutId, next);
    if (deleted) {
        res.status(200).json({
            Message: "Delted successfully"
        })
    } else {
        next(new CustomeError("Something send wrong", 401));
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
    deleteCartItems,
    addWishList,
    viewWishlist,
    deleteWishlistprdct,
    userPayment,
    succes,
    cancel,
    deleteall
} 