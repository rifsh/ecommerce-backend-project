import { NextFunction, Request, Response } from 'express';
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

dotenv.config({ path: path.join(__dirname,'../../config.env')});


//JWT_token
let userToken = (id): string => {
    return jwt.sign({ id: id }, process.env.jwt_string, {
        expiresIn: 30000000
    })
}


const signUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await Users.create(req.body);
    const token = userToken(newUser._id)
    res.status(200).json({
        status: "Success",
        token,
        data: {
            user: newUser
        }
    })
})
const logIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const usrname = req.body.usrname;
    const password = req.body.password;
    if (!usrname || !password) {
        const err = new customeError(`Please provide a Username and password`, 404);
        return next(err);
    }
    const logedUser = await Users.findOne({ usrname }).select('+password');


    if (!logedUser || !await logedUser.comparePassword(password, logedUser.password)) {
        const error = new customeError('Incorrect username or password', 404);
        return next(error);
    }

    const token = userToken(logedUser._id)

    res.status(200).json({
        status: "Valid",
        token,
        // datas: {
        //     user: logedUser
        // },
    })
})
const productById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const products = await producModel.findById(req.params.id);
    if (!products) {
        next(new customeError(`Product not found with id ${req.params.id}`, 401))
    }
    res.status(200).json({
        status: "Found",
        products
    })

})
const addToCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.body.productId;
    const userId = req.params.id;
    const prodcut = await producModel.findById(productId);
    const existingUser = await CartModel.findOne({ userId: userId });
    const existingProduct = await CartModel.findOne({ userId: userId, products: productId });
    console.log(existingProduct);



    if (existingUser && !existingProduct) {
        existingUser.products.push(productId);
        await existingUser.save();
        res.status(200).json({
            status: "Success",
            message: "Your product is added to cart"
        })
    } else if (!existingUser) {
        //New user
        const addingCart = await CartModel.create({ userId: userId, products: [productId] });
        res.status(200).json({
            status: "Success",
            message: "Your product is added to cart"
        })
    } else if (existingProduct) {
        next(new customeError('product is already in cart', 404))
    }
})
const viewCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const viewCart = await CartModel.findOne({ userId: req.params.id });
    // const products = await producModel.findById(viewCart.products);
    console.log(viewCart);

    res.status(200).json({
        status: "OK",
        datas: {
            products: viewCart
        }
    })



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
    const tokenDecode: tokenInterface |string | JwtPayload = await jwt.verify(token, 'asd-qwe-asd-qwe');
    console.log(tokenDecode);
    
    //If the user exist
    const user = await Users.findById(tokenDecode.id);
    
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
    }else{
        next(new customeError(`User not found with id${userId}`, 404));
    }

})
const deleteWishlistprdct = catchAsync(async (req: Request, res: Response, next) => {
    const id: string = req.params.id;
    const prodcutId = req.body.productId;
    const productFinding = await wishListModel.findOne({userId: id ,wishlistedproducts: prodcutId });
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
    productById,
    protectRoute
} 