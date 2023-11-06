import { resolvers } from "./user.resolvers";
import { readFile } from "../../helpers/fs.helper";

const typeDefs = readFile('src/modules/users/user.scheme.gql');

export default {
    resolvers,
    typeDefs
}