import { IResolvers } from "@graphql-tools/utils";
import { authValidation } from "../../validation/auth.validation";
import { createWriteStream } from "fs";
import { resolve } from "path"; 
import { GraphQLUpload } from "graphql-upload-ts"; 
import { Category } from "../../models/category/category.model";
import { models } from "../../models/madels/carModel.model";
import { log } from "console";

const resolvers: IResolvers = {
  Query: { 
    category: async ():Promise<Object> => {    
      const category = await Category.findAll({
        include:models 
      });  
  
      return category
    }
    },
    Mutation: {
      creatCategory: async (_,{input,file},{authToken}):Promise<Object> => {
        const {category_name}:category = input;
  
        const error = authValidation(authToken);
        if (error) {
         return error;
        }
 
        const checkCategory = await Category.findOne({where:{category_name}});
  
        if(checkCategory){
          return {
            msg:"such a category exists",
            status:400
          }
        }
  
        if(!file){
          return {
            msg:"enter the fie!",
            status:400
          }
        }
  
        const { filename, createReadStream } = await file;
        const timestampedFilename = Date.now() + filename.replace(/\s/g, "");

        const filePath = resolve( "uploads", timestampedFilename);
        const stream = createReadStream();
        const out = createWriteStream(filePath);
        stream.pipe(out);
  
        const newCategory = await Category.create({
          category_name,
          category_image:timestampedFilename
        })
   
        return {
          msg:"created category",
          data:newCategory,
          status:200 
        }
    },
    updateCategory: async (_,{input,file},{authToken}):Promise<Object> => {
      const {category_id,category_name}:category_id = input;

      const error = authValidation(authToken);
      if (error) {
       return error;
      }

      const categoryFind = await Category.findOne({where:{category_id}});

      if(!categoryFind){
        return {
          msg:"category not found",
          status:400
        }
      }

      if(!file){
        return {
          msg:"enter the fie!",
          status:400
        }
      }

      const { filename, createReadStream } = await file;
      const timestampedFilename = Date.now() + filename.replace(/\s/g, "");
      console.log(timestampedFilename);
      
      const filePath = resolve(process.cwd(), "uploads", timestampedFilename);
      const stream = createReadStream();

      const out = createWriteStream(filePath);
      stream.pipe(out);

      const newCategory = await Category.update({
        category_name,
        category_image:"uploads/" + timestampedFilename 
      },{
        where:{category_id}
      })

      return {
        msg:"created category",
        data:newCategory,
        status:200
      }
  },
  deleteCategory: async (_,{id},{authToken}) => {
    const error = authValidation(authToken);
    if (error) {
     return error;
    }

    const checkCategory = await Category.destroy({where:{category_id:id}});

    if(checkCategory == 0){
      return {
        msg:"category not found",
        data:null,
        status:404
      }
    }
 
    return {
      msg:"deleted category",
      data:checkCategory,
      status:200
    }
  }, 
  categoryPagination: async (_,{limit,offset}):Promise<Object> => {

    const limitedData = await Category.findAll({
      limit:limit,
      offset:offset
    })

    return {
      msg:"ok",
      data:limitedData,
      status:200
    }
  }
  },
  Upload:GraphQLUpload,
};

export { resolvers };
