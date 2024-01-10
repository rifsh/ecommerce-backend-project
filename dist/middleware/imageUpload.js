"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userImgUpload = exports.imgUpload = void 0;
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const customerror_1 = require("../utils/customerror");
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../config.env') });
const storage = multer_1.default.diskStorage({
    destination: '../uploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 1024 * 1024 }
});
const cloudin = cloudinary_1.default.v2;
cloudin.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
const imgUpload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    upload.single("image")(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        // const file = req.file;
        // console.log(req.file);
        if (err) {
            next(new customerror_1.CustomeError(err.message, 401));
        }
        try {
            const result = yield cloudin.uploader.upload(req.file.path, {
                folder: "products"
            });
            req.body.image = result.secure_url;
            fs_1.default.unlink(req.file.path, (unlinker) => {
                if (unlinker) {
                    console.log('Error, deleting local file', unlinker);
                }
            });
            next();
        }
        catch (error) {
            next(new customerror_1.CustomeError('Error uploading products file to Cloudinary', 404));
        }
    }));
});
exports.imgUpload = imgUpload;
const userImgUpload = (req, res, next) => {
    upload.single("profileImg")(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            next(new customerror_1.CustomeError('Not uplaoded', 401));
        }
        try {
            const result = yield cloudin.uploader.upload(req.file.path, {
                folder: "userimg"
            });
            req.body.image = result.secure_url;
            fs_1.default.unlink(req.file.path, (unlinker) => {
                if (unlinker) {
                    console.log('Error, deleting local file', unlinker);
                }
            });
            next();
        }
        catch (error) {
            next(new customerror_1.CustomeError('Error uploading file to Cloudinary', 404));
        }
    }));
};
exports.userImgUpload = userImgUpload;
