"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_resolvers_1 = require("./user.resolvers");
const fs_helper_1 = require("../../helpers/fs.helper");
const typeDefs = (0, fs_helper_1.readFile)('src/modules/users/user.scheme.gql');
exports.default = {
    resolvers: user_resolvers_1.resolvers,
    typeDefs
};
