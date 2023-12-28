import { NextFunction, Request, Response } from "express";
import { producModel } from "../models/productsmodel";
import catchAsync from "../utils/asyncHandler";
import { userSrvc } from "../services/user/auth-controller";

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
    userSrvc.products(req,res,next)
})
export const productCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    userSrvc.productByCategory(req,res,next)
})
export const get_product_Byid = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    userSrvc.productById(req,res,next)
})
