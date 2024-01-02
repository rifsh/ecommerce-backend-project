import cloudinary from 'cloudinary/lib';
import dotenv from 'dotenv';
import path, { resolve } from 'path';

dotenv.config({ path: path.join(__dirname, '../../config.env') });

const cloudinnary = cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

export const uploadingCloud = (req, res, next) => {
    
} 
