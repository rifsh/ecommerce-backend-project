import { NextFunction, Request, Response } from "express";
import { Users } from "../../models/user/usermodel";
import catchAsync from "../../utils/asyncHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose, { Mongoose, MongooseBulkWriteOptions, MongooseDocumentMiddleware } from "mongoose";
import { customeError } from "../../utils/customerror";
import { producModel } from "../../models/productsmodel";
import { CartModel } from "../../models/user/cartModel";
import { wishListModel } from "../../models/user/wishlistModel";
import tokenInterface from "../../models/interfaces/user_interfaces/tokeninterface";

let user;

//JWT_token
let userToken = (id?): string => {
    return jwt.sign({ id: id }, process.env.jwt_string, {
        expiresIn: 30000000
    })
}
const signUp = async (req: Request, res: Response, next: NextFunction): Promise<userInterface> => {
    const newUser = await Users.create(req.body);
    return newUser
}
const logIn = async (req: Request, res: Response, next: NextFunction) => {
    const usrname = req.body.username;
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
    const token = userToken(logedUser._id);
    res.status(200).json({
        status: "Valid",
        token
    })

}
const products = async (req: Request, res: Response, next: NextFunction) => {
    let products: Product[] = [];
    products = await producModel.find({});
    return products
}
const productByCategory = async (req: Request, res: Response, next: NextFunction): Promise<object> => {
    const category = req.params.id;
    const categorizedProduts = await producModel.find({ category: category });

    if (categorizedProduts.length === 0) {
        next(new customeError(`Product not found with the category '${category}'`, 404));
    } else {
        res.status(200).json({
            totalProducts: categorizedProduts.length,
            products: categorizedProduts
        })
        return categorizedProduts;
    }

}
const productById = async (req: Request, res: Response, next: NextFunction) => {
    let products: Product[] = [];
    products = await producModel.findById(req.params.id);
    if (!products) {
        next(new customeError(`Product not found eith given Id '${req.params.id}'!!`, 404))
    } else {
        res.status(200).json({
            status: "OK",
            datas: {
                products
            }
        })
    }
}
const addToCart = async (req: Request, res: Response, next: NextFunction) => {
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
}
const viewCart = async (req: Request, res: Response, next: NextFunction) => {
    const viewCart = await CartModel.findOne({ userId: req.params.id });
    // const products = await producModel.findById(viewCart.products);
    console.log(viewCart);

    res.status(200).json({
        status: "OK",
        datas: {
            products: viewCart
        }
    })
}
const addToWishList = async (req: Request, res: Response, next: NextFunction) => {
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
}
const viewWishList = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const wishlist = await wishListModel.findOne({ userId });

    if (wishlist) {
        res.status(200).json({
            wishlist
        })
    } else {
        next(new customeError(`User not found with id${userId}`, 404));
    }

}
const deleteWishList = async (req: Request, res: Response, next: NextFunction) => {
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
}
const routeProtecter = async (req: Request, res: Response, next: NextFunction) => {
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
    user = await Users.findById(decodeId);
    if (!user) {
        next(new customeError('User is not present', 401));
    }

    next();
    return user
}
const addToOrder = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    console.log(await user);
    
}



export const userSrvc = {
    userToken,
    signUp,
    logIn,
    products,
    productByCategory,
    productById,
    addToCart,
    viewCart,
    addToWishList,
    viewWishList,
    deleteWishList,
    addToOrder,
    routeProtecter
}