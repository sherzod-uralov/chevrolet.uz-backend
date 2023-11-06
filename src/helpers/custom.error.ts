import {GraphQLError} from 'graphql'

const customErr = (errorText:String,errorCode:String,statusCode:number) => {
    return new GraphQLError(`${errorText}`,{
        extensions:{
            code:errorCode,
            http:{status:errorCode}
        }
    })
}

export {customErr}