import { NextFunction, Request, Response } from "express";
import { producModel } from "../models/productsmodel";
import catchAsync from "../utils/asyncHandler";

export const add_product = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const addedProducts: Product[] = [];
    addedProducts.push(await producModel.create(req.body))
    res.status(200).json({
        status: 'OK',
        datas: {
            products: addedProducts
        }
    })
})


export const get_product = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
export const get_product_Byid = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
