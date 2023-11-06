"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_resolvers_1 = require("./model.resolvers");
const fs_helper_1 = require("../../helpers/fs.helper");
const typeDefs = (0, fs_helper_1.readFile)('src/modules/madels/model.scheme.gql');
exports.default = {
    resolvers: model_resolvers_1.resolvers,
    typeDefs
};
