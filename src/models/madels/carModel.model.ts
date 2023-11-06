import { DataTypes, Model } from "sequelize";
import { newSequelize } from "../../config/sequlelize";
import { Category } from "../category/category.model.js"; 

class models extends Model {}

models.init( 
  {
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Category,
        key: 'category_id',
      }},
    model_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
    },
    toning: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    engine: {
      type: DataTypes.FLOAT,
    },
    year: {
      type: DataTypes.STRING(15),
    },
    color: {
      type: DataTypes.STRING(50),
    },
    distance: { 
      type: DataTypes.INTEGER,
    },
    gearbook: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.FLOAT,
    },
    inside_image: {
      type: DataTypes.STRING(100),
    },
    outside_image: {
      type: DataTypes.STRING(100),
    },
    model_type_image: {
      type: DataTypes.STRING(100),
    },
    
  },
  {
    sequelize: newSequelize, 
    tableName: "models",
    paranoid: true,
  }
);
  

Category.hasMany(models, { foreignKey: "category_id" });
models.belongsTo(Category, { foreignKey: "category_Id" });



export { models }; 
