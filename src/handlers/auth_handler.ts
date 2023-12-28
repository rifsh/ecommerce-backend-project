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
    userSrvc.viewCart(req, res, next)
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
    userSrvc.addToWishList(req, res, next)
})
const viewWishlist = catchAsync(async (req: Request, res: Response, next) => {
    userSrvc.viewWishList(req, res, next)
})
const deleteWishlistprdct = catchAsync(async (req: Request, res: Response, next) => {
    userSrvc.deleteWishList(req, res, next)
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