import { DataTypes, Model, Sequelize } from "sequelize";
import { newSequelize } from "../../config/sequlelize";

class Category extends Model {}

Category.init({
    category_id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true 
    },
    category_name: {
        type:DataTypes.STRING(50),
        allowNull:true
    },
    category_image:{
        type:DataTypes.STRING(100),
        allowNull:true
    }
},{
    sequelize:newSequelize,
    tableName:'category',   
}) 



export {Category}
 

