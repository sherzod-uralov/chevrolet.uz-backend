"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = void 0;
const joi_1 = __importDefault(require("joi"));
function validateUser(user) {
    const schema = joi_1.default.object({
        username: joi_1.default.string().regex(/^[A-Z][a-z]+$/).required(),
        password: joi_1.default.string().min(8).required(),
        checkpassword: joi_1.default.ref('password'),
    });
    return schema.validate(user);
}
exports.validateUser = validateUser;
