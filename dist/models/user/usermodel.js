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
exports.Users = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    usrname: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 're enter your password'],
        //only work for save and create
        validate: {
            validator: function (val) {
                return val === this.password;
            },
            message: 'Password and confirm password is not same'
        }
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        validate: [validator_1.default.isEmail, 'Please enter a valid email']
    },
    image: {
        type: String,
        required: [true, 'Image is required']
    },
    isDeleted: {
        type: Boolean,
        default: false,
        select: false
    },
    cretedOn: {
        type: Date,
        default: new Date().getDate(),
        select: false
    }
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            return next();
        }
        //password encrypting
        this.password = yield bcryptjs_1.default.hash(this.password, 12);
        this.confirmPassword = undefined;
        next();
    });
});
userSchema.methods.comparePassword = function (candidatePassword, dbpswrd) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcryptjs_1.default.compare(candidatePassword, dbpswrd); // Compare candidate password with stored hash
    });
};
exports.Users = mongoose_1.default.model('userDetail', userSchema);
