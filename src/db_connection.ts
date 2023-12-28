import mongoose from 'mongoose';
import path from 'path'
import * as dotenv from 'dotenv';
dotenv.config({path: path.join(__dirname,'../config.env')});


export function connection() {
    mongoose.connect(process.env.DATABASE_UR, {
        dbName:'User'
    })
        .then((conn) => {
            console.log('connected successfully');
        }).catch((err) => {
            console.log(err.message);

        })
}