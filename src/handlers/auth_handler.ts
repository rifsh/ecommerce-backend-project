import { NextFunction, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { Users } from '../models/usermodel';
import catchAsync from '../utils/asyncHandler';
import jwt, { Jwt, JwtPayload }  from 'jsonwebtoken'
import { customeError } from '../utils/customerror';
import util from 'util';

dotenv.config({path: '../../config.env'})


//JWT_token
let userToken = (id): string => {
    return jwt.sign({ id: id }, 'asd-qwe-asd-qwe', {
        expiresIn: 30000000
    })
}


export const signUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await Users.create(req.body);
    const token = userToken(newUser._id)
    res.status(200).json({
        status: "OK",
        token,
        data: {
            user: newUser
        }
    })
})
export const logIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const usrname = req.body.usrname;
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

    const token = userToken(logedUser._id)

    res.status(200).json({
        status: "Valid",
        token,
        datas: {
            user: logedUser
        },
    })
})

export const protectRoute = catchAsync(async (req: Request, res: Response, next) => {
    //Reading the token and check if it exist
    let token: string;
    const testToken = req.headers.authorization;
    if (testToken && testToken.startsWith('bearer')) {
        const sampleToken: string[] = testToken.split(' ');
        token = sampleToken[1];
    }
    
    if (!token) {
        next(new customeError('You are not logged in !!', 402));
    }

    //Validate the token
    const tokenDecode:string|JwtPayload = await jwt.verify(token, 'asd-qwe-asd-qwe');
    
    //If the user exist
    const user = await Users.findById(tokenDecode.id);
    
    if (!user) {
        next(new customeError('USer is not present', 401));
    }
    console.log(user);
    

    //If the user changed the password after the was issuea

    //Allow the user access the route

    next()
})