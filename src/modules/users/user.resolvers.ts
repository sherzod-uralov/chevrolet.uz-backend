import {Users} from '../../models/users/user.model'
import {IResolvers} from '@graphql-tools/utils'
import { customErr } from '../../helpers/custom.error';
import bcrypt from 'bcrypt'
import { verify,sign } from '../../config/jwt.config';
import { validateUser } from '../../validation/uservalidation';
import { authValidation } from '../../validation/auth.validation';
import { resolve } from 'path';
import { createWriteStream } from 'fs';
import { where } from 'sequelize';

const resolvers:IResolvers = {
    Query:{
        users: async (_,__,{authToken}):Promise< [] | Object > => {
           
          const error = authValidation(authToken);

          if(error){
            return error
          }

            const users = await Users.findAll();
            return users 
        }
    },
    Mutation:{
        login: async (_,args):Promise<Object> => {
            
            const {username,password}:users = args.input;
            
            const adminUser = await Users.findOne({where:{username}});
            
            const compare = await bcrypt.compare(String(password),String(adminUser?.dataValues.password));

            if(!compare){
                return {
                    msg:'failed login',
                    token:null,
                    logined:false
                }
            }
            const isAdmin = (adminUser as any).isAdmin;

            const token = sign({username,password,isAdmin});
            
            return {
                msg:'successfully logged in',
                token:token,
                logined:true
            }
        },
        register: async (_,args):Promise<object> => {

            const {username,password,checkpassword} = args.input;
            const findUser = await Users.findOne({where:{username}});
            
            if(findUser){
                return {
                    msg:"user alredy exist",
                    registered:false
                }
            }

            const {error} = validateUser({username,password,checkpassword});
            if(error){
               return {
                msg:error.details[0].message,
                registered:false
               }
            }
            const hashPasswd = await bcrypt.hash(String(password),6); 
            
            const token = sign({username,hashPasswd,isAdmin:false});

            const newUser = await Users.create({username,password:hashPasswd,isAdmin:false}); 


            return {
                msg:'registered',
                token: token,
                registered:true,
                user: newUser
            }
        },
        deleteUser: async (_,args,{authToken}) => {
        const {id} = args;  
          
        const error = authValidation(authToken);

        if(error){
            return error
        }

        const user = await Users.findByPk(id);
        
        await Users.destroy({where:{id}});

        return user
        },
        updateUser:  async (_,args,{authToken}):Promise<Object> => {
            const {id,username} = args.updateInput;
            const error = authValidation(authToken);

            if(error){
              return error
            }
            const verifyToken = verify(authToken);
            const searchById = await Users.findByPk(id);

            if(!searchById){
                return customErr("user not found","find error",404);
            }

            if((searchById as any).username === (verifyToken as any).username){
                return customErr('you can only make changes to your own account','update error',403);
            }

            await Users.update({username},{where:{id}});

            return {
                id,
                oldUserName:(searchById as any).username,
                newUserName:username
            }

        },
        addAdmin: async (_,{id},{authToken}) => {

            const error = authValidation(authToken);

            if(error){
                return error
            }

            const findUser = await Users.findByPk(+id);

            if(!findUser){
                return {
                    msg:"user not found",
                    data:null,
                    status:404
                }
            }

            if((findUser as any).isAdmin == true){
                return {
                    msg:"user not found",
                    data:null, 
                    status:404 
                } 
            }

            const adminRights = await Users.update({isAdmin:true},{where:{id}});

            return {
                msg:"admin right granted",
                data:adminRights,
                status:200
            }

        },
        profileUpload: async (_,{file,id},{authToken}):Promise<Object> => {

            const error = authValidation(authToken);

            if(error){
                return error
            }

            const user =verify(authToken);
            
            const findUSer = await Users.findOne({where:{username:(user as any).username}});
            
            const checkUSer = await Users.findByPk(id);
            
            if(!checkUSer){
                return {
                    msg:"user not found",
                    data:null,
                    status:404
                }
            }

            if((findUSer as any).id != id){
                return {
                    msg:"Only upload photos to your own account!",
                    data:null,
                    status:404
                }
            }


            const { filename, createReadStream } = await file;
            const timestampedFilename = Date.now() + filename.replace(/\s/g, "");
      
            const filePath = resolve(process.cwd(), "uploads", timestampedFilename);
            const stream = createReadStream();
    
            const out = createWriteStream(filePath);
            stream.pipe(out);

            await Users.update({profile_image:filePath},{where:{id}}); 

            return {
                msg:"upload profile image",
                data:filePath,
                status:200
            }
        }
    }
}

export {resolvers}