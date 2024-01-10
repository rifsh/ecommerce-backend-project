import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/asyncHandler";
import { admin_srvc } from "../../services/admin/auth-controller";

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const response = await admin_srvc.login(req, res, next);

    res.status(200).json({
        status: "Success",
        name: process.env.ADMIN_USRNAME,
        message: "Sir you are successfully logged in",
        token: response
    })
})
const users = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await admin_srvc.userFinding(req, res, next);
    res.status(200).json({
        totalUsers: users.length,
        datas: users
    })

})
const userById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await admin_srvc.userById(req, res, next);
    res.status(200).json({
        status: 'success',
        message: 'Successfully fetched user data.',
        data: user
    })

})
const viewProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const prdcts = await admin_srvc.allProducts();
    if (!prdcts) {
        res.status(200).json({
            Message: "Empty"
        })
    }
    res.status(200).json({
        totalProducts: prdcts.length,
        datas: prdcts
    })
})
const singleProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const productId: string = req.params.id;
    const products = await admin_srvc.productsById(productId);
    res.status(200).json({
        datas: products
    })
    
})
const addProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const product: Product = req.body;
    console.log(product);

    const products = await admin_srvc.addproduts(product);
    res.status(201).json({
        status: 'success',
        message: 'Successfully created a product.',
        products: products
    })
})
const updateProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const products: Product = req.body;
    const prdctId: string = req.params.id;
    const id = await admin_srvc.updateProducts(prdctId, products, next);
    res.json({
        status: 'success',
        message: `Successfully updated a product with id '${id}'`,
    })
})
const deleteProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await admin_srvc.deleteProduct(req, res, next)
})
export const adminController = {
    login,
    users,
    userById,
    viewProducts,
    singleProduct,
    addProduct,
    updateProduct,
    deleteProduct
}