"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.sign = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sign = (data) => {
    return jsonwebtoken_1.default.sign(data, `${process.env.SECRET_KEY}`);
};
exports.sign = sign;
const verify = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, `${process.env.SECRET_KEY}`);
    }
    catch (error) {
        console.error("Token verification error:", error);
        return null;
    }
};
exports.verify = verify;
