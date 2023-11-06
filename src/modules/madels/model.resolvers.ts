import { models as Models } from "../../models/madels/carModel.model";
import { IResolvers } from "@graphql-tools/utils";
import { authValidation } from "../../validation/auth.validation";
import { createWriteStream } from "fs";
import { resolve } from "path";
import { GraphQLUpload } from "graphql-upload-ts";
import { Category} from "../../models/category/category.model";
 
const resolvers: IResolvers = {
  Query: { 
    models: async (): Promise<Object> => {
      const models = await Models.findAll();

      return models;
    },
  },
   
  Mutation: {
    createCar: async (_, {input,files}, { authToken }): Promise<Object> => {
      const {
      name,
      toning,
      engine, 
      year,
      color,
      distance,
      gearbook,
      category_id,
      price
      } = input;

       const error = authValidation(authToken);
       if (error) {
        return error;
       }

       const catecory = await Category.findByPk(category_id);

       if(!catecory){
        return {
          msg:"tanlagan categoryingiz mavjud emas",
          status:400
        }
       }
      

        const arrF:Object[] = [];

      for (const file of files) {
        const { filename, createReadStream } = await file;
        const timestampedFilename = Date.now() + filename.replace(/\s/g, "");
  
        const filePath = resolve(process.cwd(), "uploads", timestampedFilename);
        const stream = createReadStream();

        const out = createWriteStream(filePath);
        stream.pipe(out);

          arrF.push(filePath)
      }

      const newCar = await Models.create({
      name,
      toning,
      engine,
      year,
      color,
      distance,
      category_id ,
      gearbook,
      inside_image:arrF[0],
      outside_image:arrF[1],
      model_type_image:arrF[2],
      price
      })
       
      return {
        mag:`${arrF.length}-ta file yuklandi`,
        data:newCar,
        status:200
      }
    },
    updateCar: async (_,{input,files,id},{authToken}):Promise<Object> => {
      const {
        name,
        toning,
        engine,
        year,
        color,
        category_id,
        distance,
        gearbook,  
        price
        } = input;

       
        
  
         const error = authValidation(authToken);
         if (error) {
          return error;
         }

        const arrUpdate = [];
  
        for (const file of files) {
          const { filename, createReadStream } = await file;
          const timestampedFilename = Date.now() + filename.replace(/\s/g, "");
    
          const filePath = resolve(process.cwd(), "uploads", timestampedFilename);
          const stream = createReadStream();
  
          const out = createWriteStream(filePath);
          stream.pipe(out);
  
          arrUpdate.push(filePath)
        }
  
        const newCar = await Models.update({
        name,
        toning,
        engine,
        year,
        color,
        distance,
        gearbook,
        category_id,
        inside_image:arrUpdate[0],
        outside_image:arrUpdate[1],
        model_type_image:arrUpdate[2],
        price
        },{
          where:{
            model_id:id
          }
        })
         
        return {
          mag:`${arrUpdate.length}-ta file yangilandi`,
          data:newCar,
          status:200 
        }
    }, 
    carPagination: async (_,{limit,offset}):Promise<Object> => {

      const limitedData = await Models.findAll({
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
  Upload: GraphQLUpload
};

export { resolvers };
