import mongoose from "mongoose";


const schema = new mongoose.Schema({
    adminName:String,
    adminPassword:String
})

export const adminModel = mongoose.model('adminlogin', schema);