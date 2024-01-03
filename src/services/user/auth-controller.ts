import { NextFunction, Request, Response } from "express";
import { Users } from "../../models/user/usermodel";
import { userToken } from "../../utils/token";
import { customeError } from "../../utils/customerror";
import { producModel } from "../../models/productsmodel";
import { orderModel } from "../../models/user/orderModel";
import { CartModel } from "../../models/user/cartModel";
import { wishListModel } from "../../models/user/wishlistModel";

let user;

//JWT_token

const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const { name, usrname, email, password, confirmPassword, image } = await req.body;
    const newUser = await Users.create({ name, usrname, email, password, confirmPassword, profileImg: image });
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
    const userFinding = await Users.findById(userId);
    const product = await producModel.findById(productId);
    const existingUser = await CartModel.findOne({ userId: userId });
    const existingProduct = await CartModel.findOne({ userId: userId, products: productId });
    if (!product || !userFinding) {
        next(new customeError("Product or User not found in the db", 404));
    } else {
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
const payment = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const user = await Users.findById(userId);
    const cart = await CartModel.findOne({userId})
    if (!user) {
        next(new customeError('User is not found!!!', 404));
    }else{
        
    }
    
}
const addToOrder = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const products = req.body.product;
    const prdctPrice = await producModel.findById(products);
    const userChecking = await Users.findById(id);
    const productChecking = await producModel.findById(products);
    const exixstingUser = await orderModel.findOne({ userid: id });
    const existingProduct = await orderModel.findOne({ userid: id, Products: products });

    if (exixstingUser && !existingProduct) {
        exixstingUser.Products.push(products);
        exixstingUser.save();
        res.status(200).json({
            status: "OK",
            message: `Product is added to your Order list with your id${id}`,
            data: {
                Order: exixstingUser
            }
        })
    } else if (existingProduct) {
        next(new customeError('Product is already exist in your order list !!!', 404));
    }
    else if (!exixstingUser) {
        const productAdding = orderModel.create({ userid: id, Products: products });

        res.status(200).json({
            status: "OK",
            message: `Product with id${products} is added to your Order list`
        })
    }

}



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
    deleteWishList,
    payment,
    addToOrder
}