import { JwtPayload } from "jsonwebtoken";
import dotenv from 'dotenv'
import jwt from "jsonwebtoken";
import { CustomeError } from "../utils/customerror";
import { NextFunction, Request, Response } from "express";
import { Users } from "../models/user/usermodel";
import path from "path";
import catchAsync from "../utils/asyncHandler";

dotenv.config({path: path.join(__dirname, '../../config.env')})

export const userRouteProtecter = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    //Reading the token and check if it exist
    let token: string;
    const testToken = req.headers.authorization;
    if (testToken && testToken.startsWith('bearer')) {
        const sampleToken: string[] = testToken.split(' ');
        token = sampleToken[1];
    }

    if (!token) {
        next(new CustomeError('You are not logged in !!', 402));
    }

    //Validate the token
    const tokenDecode = await jwt.verify(token, process.env.jwt_string);
    const tokenDec = tokenDecode as JwtPayload
    //If the user exist
    let user = await Users.findById(tokenDec.id);
    
    if (!user) {
        next(new CustomeError('User is not present', 401));
    }

    next();
})
export const adminRouteProtecter = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let token: string;
    
    const headerToken = req.headers.authorization;
    if (!headerToken) {
        next(new CustomeError('Please provide a token', 401));
    }
    if (headerToken && headerToken.toLowerCase().startsWith('bearer')) {
        token = headerToken.split(' ')[1]
    }
    if (!token) {
        next(new CustomeError('You are not logged in !!', 402));
    }
    const tokenDecode= await jwt.verify(token, process.env.jwt_string);
    const tokenDec = tokenDecode as JwtPayload;

    const admin = process.env.ADMIN_USRNAME === tokenDec.name;
    if (!admin) {
        next(new CustomeError('Admin is not present', 401));
    }
    next()
})



