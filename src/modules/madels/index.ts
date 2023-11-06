import { resolvers } from "./model.resolvers";
import { readFile } from "../../helpers/fs.helper";

const typeDefs = readFile('src/modules/madels/model.scheme.gql');
 
export default {
    resolvers, 
    typeDefs 
}