import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/asyncHandler";
import { admin_srvc } from "../../services/admin/auth-controller";
import { customeError } from "../../utils/customerror";



const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const response = await admin_srvc.login(req, res, next);

    res.status(200).json({
        status: "Success",
        message: "Sir you are successfully logged in",
        token: response
    })
})
const users = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await admin_srvc.userFinding(req, res, next);

    res.status(200).json({
        totalUsers: users.length,
        users
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
const addProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const products = await admin_srvc.addproduts(req, res, next);
    res.status(201).json({
        status: 'success',
        message: 'Successfully created a product.',
        addedProduct: products
    })
})
const updateProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = await admin_srvc.updateProducts(req, res, next);
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
    addProduct,
    updateProduct,
    deleteProduct
}