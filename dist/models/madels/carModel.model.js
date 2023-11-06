"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.models = void 0;
const sequelize_1 = require("sequelize");
const sequlelize_1 = require("../../config/sequlelize");
const category_model_js_1 = require("../category/category.model.js");
class models extends sequelize_1.Model {
}
exports.models = models;
models.init({
    category_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: category_model_js_1.Category,
            key: 'category_id',
        }
    },
    model_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(50),
    },
    toning: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    engine: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    year: {
        type: sequelize_1.DataTypes.STRING(15),
    },
    color: {
        type: sequelize_1.DataTypes.STRING(50),
    },
    distance: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    gearbook: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    price: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    inside_image: {
        type: sequelize_1.DataTypes.STRING(100),
    },
    outside_image: {
        type: sequelize_1.DataTypes.STRING(100),
    },
    model_type_image: {
        type: sequelize_1.DataTypes.STRING(100),
    },
}, {
    sequelize: sequlelize_1.newSequelize,
    tableName: "models",
    paranoid: true,
});
category_model_js_1.Category.hasMany(models, { foreignKey: "category_id" });
models.belongsTo(category_model_js_1.Category, { foreignKey: "category_Id" });
