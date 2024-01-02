import cloudinary from 'cloudinary/lib';
import dotenv from 'dotenv';
import multer from 'multer'
import path from 'path'
import { customeError } from '../utils/customerror';
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


dotenv.config({ path: path.join(__dirname, '../../config.env') });

const cloudinaryValue = cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

export const uploadingCloud = (req, res, next) => {
    upload.single("image")(req, res, async (err) => {
        if (err) {
            next(new customeError("Not found", 404));
        }
        try {
            
        } catch (error) {

        }
    })
} 
