import { NextFunction, Request, Response, request } from 'express';
import * as dotenv from 'dotenv';
import path from 'path'
import { Users } from '../models/user/usermodel';
import { producModel } from '../models/productsmodel';
import { CartModel } from '../models/user/cartModel';
import { wishListModel } from '../models/user/wishlistModel';
import catchAsync from '../utils/asyncHandler';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken'
import { customeError } from '../utils/customerror';
import tokenInterface from '../models/interfaces/user_interfaces/tokeninterface';
import { userSrvc } from '../services/user/auth-controller';

dotenv.config({ path: path.join(__dirname, '../../config.env') });

const signUp = async (req: Request, res: Response, next: NextFunction) => {
    userSrvc.signUp(req, res, next);
}
const logIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    userSrvc.logIn(req, res, next)
})
const addToCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    userSrvc.addToCart(req, res, next)
})
const viewCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    userSrvc.viewCart(req,res,next)
})
const protectRoute = catchAsync(async (req: Request, res: Response, next) => {
    //Reading the token and check if it exist
    let token: string;
    const testToken = req.headers.authorization;
    if (testToken && testToken.startsWith('bearer')) {
        const sampleToken: string[] = testToken.split(' ');
        token = sampleToken[1];
    }

    if (!token) {
        next(new customeError('You are not logged in !!', 402));
    }

    //Validate the token
    const tokenDecode: tokenInterface | String | JwtPayload = await jwt.verify(token, process.env.jwt_string);
    let decodeId: string;
    for (const key in tokenDecode) {
        if (key === 'id') {
            decodeId = tokenDecode[key]
        }

    }
    //If the user exist
    const user = await Users.findById(decodeId);

    if (!user) {
        next(new customeError('User is not present', 401));
    }


    //If the user changed the password after the was issuea

    //Allow the user access the route

    next()
})
const addWishList = catchAsync(async (req: Request, res: Response, next) => {
    const productId = req.body.productId;
    const userId = req.params.id;
    const prodcut = await producModel.findById(productId);
    const existingUser = await wishListModel.findOne({ userId: userId });
    const existingProduct = await wishListModel.findOne({ userId: userId, wishlistedproducts: productId });

    if (existingUser && !existingProduct) {
        existingUser.wishlistedproducts.push(productId);
        await existingUser.save();
        res.status(200).json({
            status: "Success",
            message: "Your product is added to Wishlist"
        })
    } else if (!existingUser) {
        //New user
        const addingCart = await wishListModel.create({ userId: userId, wishlistedproducts: [productId] });
        res.status(200).json({
            status: "Success",
            message: "Your product is added to Wishlist"
        })
    } else if (existingProduct) {
        next(new customeError('product is already in Wishlist', 404))
    }
})
const viewWishlist = catchAsync(async (req: Request, res: Response, next) => {
    const userId = req.params.id;
    const wishlist = await wishListModel.findOne({ userId });

    if (wishlist) {
        res.status(200).json({
            wishlist
        })
    } else {
        next(new customeError(`User not found with id${userId}`, 404));
    }

})
const deleteWishlistprdct = catchAsync(async (req: Request, res: Response, next) => {
    const id: string = req.params.id;
    const prodcutId = req.body.productId;
    const productFinding = await wishListModel.findOne({ userId: id, wishlistedproducts: prodcutId });
    const checkUser = await wishListModel.findOne({ userId: id });

    if (checkUser && productFinding) {
        const index = await checkUser.wishlistedproducts.indexOf(prodcutId);
        await checkUser.wishlistedproducts.splice(index, 1);
        await checkUser.save();
        res.status(200).json({
            status: "Success"
        })
    }
    else if (!productFinding) {
        next(new customeError(`Product not found with id ${prodcutId}`, 404));
    }
    else if (!checkUser) {
        next(new customeError(`User not found with id ${id}`, 404));
    }
})
export const userControllers = {
    signUp,
    logIn,
    addToCart,
    viewCart,
    addWishList,
    viewWishlist,
    deleteWishlistprdct,
    protectRoute
} 