import { Request, Response, NextFunction } from "express";
import path from "path";
import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";
import { customeError } from "../../utils/customerror";
import { Users } from "../../models/user/usermodel";
import { producModel } from "../../models/productsmodel";


dotenv.config({ path: path.join(__dirname, '../../../../config.env') });

const token = (usrname: string) => {
    return jwt.sign({ name: usrname }, process.env.jwt_string);
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    const reqAdminName = req.body.username;
    const reqAdminPassword = req.body.password;
    const adminName = process.env.ADMIN_USRNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const validation: boolean = reqAdminName === adminName && reqAdminPassword === adminPassword;
    if (!validation) {
        return next(new customeError('User name or password is incorrecct', 404))
    } else {
        const tokens = token(adminName)
        return tokens
    }
}
const userFinding = async (req: Request, res: Response, next: NextFunction) => {
    const users = Users.find();
    return users;
}
const userById = async (req: Request, res: Response, next: NextFunction) => {
    const usrId = req.params.id;
    const users = Users.findById(usrId);
    return users;
}
const addproduts = async (req: Request, res: Response, next: NextFunction) => {
    const { title, image, description, price, category } = req.body;
    const createdProduct = await producModel.create({title, image, description, price, category});
    return createdProduct
}
const updateProducts = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const {title, image, description, price, category} = req.body;
    const product = await producModel.findById(id);
    if (!product) {
        next(new customeError(`No such product found with id ${id}`, 404))
    } else {
        const updateProduct = await product.updateOne({title,image,description,price,category});
        product.save();
        return id
    }

}
const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const product = await producModel.findById(id);

    if (!product) {
        next(new customeError(`Product not found with id${id}`, 404));
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
    token,
    userFinding,
    userById,
    addproduts,
    updateProducts,
    deleteProduct

}