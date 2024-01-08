import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import path from "path";
import catchAsync from "../utils/asyncHandler";
import { Users } from "../models/user/usermodel";
import { CartModel } from "../models/user/cartModel";
import { producModel } from "../models/productsmodel";
import { CustomeError } from "../utils/customerror";

dotenv.config({ path: path.join(__dirname, '../../config.env') });

export const paymentMethod = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const userDetails = await Users.findById(userId);
    const CartProducts = await CartModel.findOne({ userId })
    const prdcts = await producModel.find({ _id: CartProducts.products });
    const prdctId = prdcts.map((x) => { return x._id });
    
    if (!userId || !prdcts || !CartProducts) {
        return next(new CustomeError('User is not found', 404));
    }
    const stripe = new Stripe(process.env.STRIPE_KEY);
    // const paymentDetails = stripe.customers.create({
    //     name: userDetails.name,
    //     email: userDetails.email,
    //     address: {
    //         line1:"jahfar123",
    //         line2:"j123",
    //         country: "india",
    //         city:"Vengara",
    //         state:"Kerala",
    //         postal_code:'676508'
    //     }
    // })
    const mainStripe = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: prdcts.map((v) => {
            const items = v;
            return {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: items.title,
                    },
                    unit_amount: items.price * 100
                },
                quantity: 1
            }
        }),
        success_url: 'http://localhost:3000/api/users/success',
        cancel_url: 'http://localhost:3000/api/users/cancel'
    })
    if (!mainStripe) {
        return next(new CustomeError('Error occured on  Session side', 404))
    }
    res.status(200).json({
        status: "OK",
        link: mainStripe.url
    })
    // const order = new orderModel({
    //     userid: userId,
    //     products: prdcts,
    //     totalItems:prdcts.length,
    //     orderId: mainStripe.id
    // })
    // order.save();

})