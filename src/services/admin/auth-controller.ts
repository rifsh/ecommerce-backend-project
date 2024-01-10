import { Request, Response, NextFunction } from "express";
import path from "path";
import { adminToken } from '../../utils/token'
import dotenv from "dotenv";
import { CustomeError } from "../../utils/customerror";
import { Users } from "../../models/user/usermodel";
import { producModel } from "../../models/productsmodel";
import { adminModel } from "../../models/admin/login";


dotenv.config({ path: path.join(__dirname, '../../../../config.env') });


const login = async (req: Request, res: Response, next: NextFunction) => {
    const reqAdminName = req.body.username;
    const reqAdminPassword = req.body.password;
    const adminName = process.env.ADMIN_USRNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const validation: boolean = reqAdminName === adminName && reqAdminPassword === adminPassword;
    if (!validation) {
        return next(new CustomeError('User name or password is incorrecct', 404))
    } else {
        await adminModel.create({ adminName: reqAdminName, adminPassword: reqAdminPassword });
        const tokens = adminToken(adminName);
        return tokens
    }
}
const userFinding = async (req: Request, res: Response, next: NextFunction) => {
    const users = await Users.find();
    if (!users || users.length === 0) {
        next(new CustomeError("Users not found in the data base!!!", 404));
    } else {
        return users;
    }
}
const userById = async (req: Request, res: Response, next: NextFunction) => {
    const usrId = req.params.id;
    const users = await Users.findById(usrId);
    if (!users) {
        next(new CustomeError(`User is not present in the database with id '${usrId}' `, 404));
    } else {
        return users;
    }
}
const allProducts = async () => {
    return await producModel.find()
}
const productsById = async(id: string) => {
    return producModel.findById(id);    
}
const addproduts = async (product: Product) => {
    console.log(product);

    const createdProduct = await producModel.create(product);
    return createdProduct
}
const updateProducts = async (id: string, prodcut: Product, next: NextFunction) => {
    const product = await producModel.findById(id);

    if (!product) {
        next(new CustomeError(`No such product found with id ${id}`, 404))
    } else {
        const updateProduct = await product.updateOne(prodcut);
        product.save();

        return id
    }
}
const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const product = await producModel.findById(id);

    if (!product) {
        next(new CustomeError(`Product not found with id${id}`, 404));
    } else {
        const deletedPrdct = await producModel.findOneAndDelete({ _id: id });
        res.json({
            status: 'success',
            message: `Successfully deleted a product with id '${id}'`,
        })
    }
    return product;


}

export const admin_srvc = {
    login,
    token: adminToken,
    userFinding,
    userById,
    allProducts,
    productsById,
    addproduts,
    updateProducts,
    deleteProduct

}