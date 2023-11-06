"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const jwt_config_1 = require("../config/jwt.config");
const custom_error_1 = require("../helpers/custom.error");
const authValidation = (authToken) => {
    try {
        const verifyToken = (0, jwt_config_1.verify)(authToken);
        if (authToken === undefined) {
            return (0, custom_error_1.customErr)("not authorized", "auth error", 401);
        }
        if (!verifyToken) {
            return (0, custom_error_1.customErr)("token is invalid or expired", "auth error", 403);
        }
        if (verifyToken.isAdmin == false) {
            return (0, custom_error_1.customErr)("you are not an admin", "admin error", 403);
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.authValidation = authValidation;
