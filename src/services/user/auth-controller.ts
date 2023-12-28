import { NextFunction, Request, Response } from "express";
import { Users } from "../../models/user/usermodel";
import catchAsync from "../../utils/asyncHandler";
import jwt from "jsonwebtoken";
import mongoose, { Mongoose, MongooseBulkWriteOptions, MongooseDocumentMiddleware } from "mongoose";
import { customeError } from "../../utils/customerror";
import { producModel } from "../../models/productsmodel";
import { CartModel } from "../../models/user/cartModel";



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
    const prodcut = await producModel.findById(productId);
    const existingUser = await CartModel.findOne({ userId: userId });
    const existingProduct = await CartModel.findOne({ userId: userId, products: productId });
    console.log(existingProduct);



    if (existingUser || !existingProduct) {
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






export const userSrvc = {
    signUp,
    logIn,
    products,
    productById,
    addToCart,
    viewCart
}