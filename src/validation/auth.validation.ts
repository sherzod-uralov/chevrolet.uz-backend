import { verify } from "../config/jwt.config";
import { customErr } from "../helpers/custom.error";

const authValidation = (authToken:any):any =>{
    try {
    const verifyToken = verify(authToken);
        
    if(authToken === undefined){
       return customErr("not authorized","auth error",401)
        
    }

    if(!verifyToken){
       return customErr("token is invalid or expired","auth error",403)
    }

    if((verifyToken as any).isAdmin == false){
        return customErr("you are not an admin","admin error",403)
    }

    } catch (error) {
        console.log(error);
    }
}

export {authValidation}