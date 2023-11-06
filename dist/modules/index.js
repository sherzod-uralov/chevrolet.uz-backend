"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./users/index"));
const index_2 = __importDefault(require("./madels/index"));
const index_3 = __importDefault(require("./category/index"));
const schema_1 = require("@graphql-tools/schema");
exports.default = (0, schema_1.makeExecutableSchema)({
    resolvers: [index_1.default.resolvers, index_2.default.resolvers, index_3.default.resolvers],
    typeDefs: [index_1.default.typeDefs, index_2.default.typeDefs, index_3.default.typeDefs]
});
