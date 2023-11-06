"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customErr = void 0;
const graphql_1 = require("graphql");
const customErr = (errorText, errorCode, statusCode) => {
    return new graphql_1.GraphQLError(`${errorText}`, {
        extensions: {
            code: errorCode,
            http: { status: errorCode }
        }
    });
};
exports.customErr = customErr;
