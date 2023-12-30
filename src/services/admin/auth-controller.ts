import { Request, Response, NextFunction } from "express";
import path from "path";
import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";
import { customeError } from "../../utils/customerror";
import { Users } from "../../models/user/usermodel";
import { UserPreferences } from "typescript";
import tokenInterface from "../../models/interfaces/user_interfaces/tokeninterface";
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
const routeProtector = async (req: Request, res: Response, next: NextFunction) => {
    let validTokens: string;
    const authentication = req.headers.authorization;
    if (authentication && authentication.startsWith('bearer')) {
        const sampleToken: string[] = authentication.split(' ');
        validTokens = sampleToken[1];
    }
    if (!validTokens) {
        next(new customeError('You are not loggedin !!!', 404));
    }
    const tokenDecode: tokenInterface | String | JwtPayload = await jwt.verify(validTokens, process.env.jwt_string);
    let adminName: string;
    for (const key in tokenDecode) {
        if (key === 'name') {
            adminName = tokenDecode[key];
        }
    }
    const tokeValidation: boolean = process.env.ADMIN_USRNAME === adminName;
    if (!tokeValidation) {
        next(new customeError('You are not loggedin', 404));
    }
    next()
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
    const enteredProduct: Product[] = req.body;
    const createdProduct = await producModel.create(enteredProduct);
    return createdProduct
}
const updateProducts = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = req.params.id;
    const product = await producModel.findById(id);
    if (!product) {
        next(new customeError(`No such product found with id ${id}`, 404))
    } else {
        const updateProduct = await product.updateOne(req.body);
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
    routeProtector,
    userFinding,
    userById,
    addproduts,
    updateProducts,
    deleteProduct

}