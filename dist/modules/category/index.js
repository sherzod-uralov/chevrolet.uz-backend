"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const category_resolvers_1 = require("./category.resolvers");
const fs_helper_1 = require("../../helpers/fs.helper");
const typeDefs = (0, fs_helper_1.readFile)('src/modules/category/category.scheme.gql');
exports.default = {
    resolvers: category_resolvers_1.resolvers,
    typeDefs
};
