"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userToken = exports.adminToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminToken = (usrname) => {
    return jsonwebtoken_1.default.sign({ name: usrname }, process.env.jwt_string, {
        expiresIn: 86400000
    });
};
exports.adminToken = adminToken;
const userToken = (id) => {
    return jsonwebtoken_1.default.sign({ id: id }, process.env.jwt_string, {
        expiresIn: 86400000
    });
};
exports.userToken = userToken;
