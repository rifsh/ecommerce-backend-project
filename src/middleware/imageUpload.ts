import { NextFunction, Request, Response } from 'express-serve-static-core';
import fs from 'fs'
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { customeError } from '../utils/customerror';

dotenv.config({ path: path.join(__dirname, '../../config.env') });


const storage = multer.diskStorage({
    destination: path.join(__dirname, '../upload'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 }
});


const cloudin = cloudinary.v2;
cloudin.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

export const imgUpload = (req: Request, res: Response, next: NextFunction) => {
    upload.single("image")(req, res, async (err) => {
        if (err) {
            next(new customeError('Not uplaoded', 401));
        }
        try {
            const result = await cloudin.uploader.upload(req.file.path, {
                folder: "products"
            })
            req.body.image = result.secure_url;
            fs.unlink(req.file.path, (unlinker) => {
                if (unlinker) {
                    console.log('Error, deleting local file', unlinker);
                }
            })
            next()
        } catch (error) {
            next(new customeError('Error uploading file to Cloudinary', 404));
        }
    })
} 
