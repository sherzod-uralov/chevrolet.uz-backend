import users from './users/index'
import model from './madels/index'
import category from './category/index'
import {makeExecutableSchema} from '@graphql-tools/schema'


export default makeExecutableSchema({
    resolvers:[users.resolvers,model.resolvers,category.resolvers],
    typeDefs:[users.typeDefs,model.typeDefs,category.typeDefs]
})


