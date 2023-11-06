import { resolvers } from "./category.resolvers";
import { readFile } from "../../helpers/fs.helper";

const typeDefs = readFile('src/modules/category/category.scheme.gql');
 
export default {
    resolvers, 
    typeDefs 
}