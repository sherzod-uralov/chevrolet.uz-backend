"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const sequelize_1 = require("sequelize");
const sequlelize_1 = require("../../config/sequlelize");
class Category extends sequelize_1.Model {
}
exports.Category = Category;
Category.init({
    category_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    category_name: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true
    },
    category_image: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true
    }
}, {
    sequelize: sequlelize_1.newSequelize,
    tableName: 'category',
});
