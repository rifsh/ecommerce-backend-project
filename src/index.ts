import exp, {Express, NextFunction, Request, Response} from 'express';
import {router} from './routers/userRouter';
import { customeError } from './utils/customerror';
import { errorHandler } from './handlers/errormiddlaware';



export const  app:Express = exp();

app.use(exp.json());




app.use('/api/users',router );

app.all('*',(req:Request,res:Response,next:NextFunction)=>{
    const err = new customeError(`Can't find url '${req.originalUrl}' on the server!`,404);
    next(err);
})

app.use(errorHandler);