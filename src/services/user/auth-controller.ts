import { NextFunction, Request, Response } from "express";
import { Users } from "../../models/user/usermodel";
import { userToken } from "../../utils/token";
import { CustomeError } from "../../utils/customerror";
import { producModel } from "../../models/productsmodel";
import { CartModel } from "../../models/user/cartModel";
import { wishListModel } from "../../models/user/wishlistModel";
import { paymentMethod } from "../../middleware/payment";
import { Usersignup } from "../../interfaces/user/userSignup";
import userCartInterface from "../../interfaces/user/user_cart";
import { ObjectId } from "mongoose";
import wishlistInterface from "../../interfaces/user/wishlist_model";


//JWT_token

const signUp = async (userDatas: Usersignup): Promise<Usersignup> => {
    const newUser = await Users.create(userDatas);
    return newUser
}
const logIn = async (usrname: string, password: string, next: NextFunction): Promise<string> => {
    if (!usrname || !password) {
        const err = new CustomeError(`Please provide a Username and password`, 404);
        next(err);
    }
    const logedUser = await Users.findOne({ usrname }).select('+password');


    if (!logedUser || !await logedUser.comparePassword(password, logedUser.password)) {
        const error = new CustomeError('Incorrect username or password', 404);
        next(error);
    }
    const token = userToken(logedUser._id);
    return token

}
const products = async () => {
    let products: Product[] = [];
    products = await producModel.find({});
    return products
}
const productByCategory = async (category: string, next: NextFunction): Promise<Product[]> => {
    const categorizedProduts = await producModel.find({ category: category });

    if (categorizedProduts.length === 0) {
        next(new CustomeError(`Product not found with the category '${category}'`, 404));
    } else {
        return categorizedProduts;
    }

}
const productById = async (productId: string, next: NextFunction): Promise<Product[]> => {
    let products: Product[] = [];
    products = await producModel.findById(productId);
    if (!products) {
        next(new CustomeError(`Product not found eith given Id '${productId}'!!`, 404))
    } else {
        return products
    }
}
const addToCart = async (productId: ObjectId, userId: string, res: Response, next: NextFunction) => {
    const userFinding = await Users.findById(userId);
    const product = await producModel.findById(productId);
    const existingUser = await CartModel.findOne({ userId: userId });
    const existingProduct = await CartModel.findOne({ userId: userId, products: productId });

    if (existingProduct) {
        res.status(200).json({
            status: "Success",
            message: "Product is already present in the cart"
        })
    }
    if (!product || !userFinding) {
        next(new CustomeError("Product or User not found in the db", 404));
    } else {
        if (existingUser && !existingProduct) {
            existingUser.products.push(productId);
            await existingUser.save();
            res.status(200).json({
                status: "Success",
                message: "Your product is added to cart",
                cart: existingUser,
                totalProducts: existingUser.products.length
            })
        } else if (!existingUser) {
            //New user
            const addingCart = await CartModel.create({ userId: userId, products: [productId] });
            res.status(200).json({
                status: "Success",
                message: "Your product is added to cart",
                cart: addingCart,
                totalProducts: addingCart.products.length
            })
        }

    }

}
const viewCart = async (userId: string): Promise<Product[]> => {
    const viewCart = await CartModel.findOne({ userId: userId });
    const productId = viewCart.products
    const products = await producModel.find({ _id: productId });
    return products
}
const deleteCart = async (id: string, prdctId: ObjectId, next:NextFunction) => {
    const productFinding = await CartModel.findOne({ userId: id, products: prdctId });
    const checkUser = await CartModel.findOne({ userId: id });
    if (checkUser && productFinding) {
        const index = await checkUser.products.indexOf(prdctId);
        await checkUser.products.splice(index, 1);
        await checkUser.save();
        return checkUser
    }
    else if (!productFinding) {
        next(new CustomeError(`Product not found with id ${prdctId}`, 404));
    }
    else if (!checkUser) {
        next(new CustomeError(`User not found with id ${id}`, 404));
    }
}
const addToWishList = async (productId: ObjectId, userId: string, res: Response, next: NextFunction) => {
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
        next(new CustomeError('product is already in Wishlist', 404))
    }
}
const viewWishList = async (userId: string, res: Response, next: NextFunction) => {
    const wishlist = await wishListModel.findOne({ userId });
    if (wishlist) {
        res.status(200).json({
            wishlist
        })
    } else {
        next(new CustomeError(`User not found with id${userId}`, 404));
    }

}
const deleteWishList = async (id: string, prodcutId: ObjectId, next: NextFunction): Promise<wishlistInterface> => {
    const productFinding = await wishListModel.findOne({ userId: id, wishlistedproducts: prodcutId });
    const checkUser = await wishListModel.findOne({ userId: id });
    if (checkUser && productFinding) {
        const index = await checkUser.wishlistedproducts.indexOf(prodcutId);
        await checkUser.wishlistedproducts.splice(index, 1);
        await checkUser.save();
        return checkUser
    }
    else if (!productFinding) {
        next(new CustomeError(`Product not found with id ${prodcutId}`, 404));
    }
    else if (!checkUser) {
        next(new CustomeError(`User not found with id ${id}`, 404));
    }
}
const payment = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const user = await Users.findById(userId);
    const cart = await CartModel.findOne({ userId })
    paymentMethod(req, res, next);

}



export const userSrvc = {
    signUp,
    logIn,
    products,
    productByCategory,
    productById,
    addToCart,
    viewCart,
    deleteCart,
    addToWishList,
    viewWishList,
    deleteWishList,
    payment,
}