"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenChecker = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const jwt_config_1 = require("../config/jwt.config");
const tokenChecker = (req, res, next) => {
    try {
        if (req.body.operationName === 'login') {
            return next();
        }
        const token = req.headers.authorization;
        if (!token) {
            return res.sendStatus(401);
        }
        try {
            const checkToken = (0, jwt_config_1.verify)(token);
            req.token = checkToken;
            return next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                return res.sendStatus(403);
            }
            console.error(error);
            return res.sendStatus(500);
        }
    }
    catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
};
exports.tokenChecker = tokenChecker;
