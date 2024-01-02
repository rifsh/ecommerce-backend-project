import exp, {Express, NextFunction, Request, Response} from 'express';
import {userRouter} from './routers/userRouter';
import {adminRouter} from './routers/adminRouter';
import { customeError } from './utils/customerror';
import { errorHandler } from './handlers/errormiddlaware';



export const  app:Express = exp();

app.use(exp.json());



app.use('/api/users',userRouter );
app.use('/api/admin',adminRouter );
app.all('*',(req:Request,res:Response,next:NextFunction)=>{
    const err = new customeError(`Can't find url '${req.originalUrl}' on the server!`, 404);
    next(err);
})
