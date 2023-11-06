import { DataTypes, Model, TEXT } from "sequelize";
import { newSequelize } from "../../config/sequlelize";

class Users extends Model {} 

Users.init({
    id:{  
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    username: {
        type:DataTypes.STRING(50),
        allowNull:true
    },
    password:{
        type:DataTypes.STRING(100), 
        allowNull:true
    },
    isAdmin:{
        type:DataTypes.BOOLEAN, 
        defaultValue:false
    },
    profile_image: { 
        type:TEXT
    }
},{
    sequelize:newSequelize,
    tableName:'users',
    paranoid:true
})

export {Users}