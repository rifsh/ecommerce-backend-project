import { NextFunction, Request, Response } from "express";
import { Users } from "../../models/user/usermodel";
import catchAsync from "../../utils/asyncHandler";
import jwt from "jsonwebtoken";
import mongoose, { Mongoose, MongooseBulkWriteOptions, MongooseDocumentMiddleware } from "mongoose";
import { customeError } from "../../utils/customerror";
import { producModel } from "../../models/productsmodel";
import { CartModel } from "../../models/user/cartModel";
import { wishListModel } from "../../models/user/wishlistModel";



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
const products = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let products: Product[] = [];
    products = await producModel.find({});
    res.status(200).json({
        status:"OK",
        total_Products: products.length,
        datas:{
            products
        }
    })
})
const productByCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const category = req.params.id;
    const categorizedProduts = await producModel.findOne({category:category});
    console.log(categorizedProduts);
    
    
})
const productById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let products: Product[] = [];
    products = await producModel.findById(req.params.id);
    res.status(200).json({
        status:"OK",
        total_Products: products.length,
        datas:{
            products
        }
    })
})
const addToCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.body.productId;
    const userId = req.params.id;
    const product = await producModel.findById(productId);
    const existingUser = await CartModel.findOne({ userId: userId });
    const existingProduct = await CartModel.findOne({ userId: userId, products: productId });

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
const addToWishList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
const viewWishList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
const deleteWishList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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






export const userSrvc = {
    signUp,
    logIn,
    products,
    productByCategory,
    productById,
    addToCart,
    viewCart,
    addToWishList,
    viewWishList,
    deleteWishList
}