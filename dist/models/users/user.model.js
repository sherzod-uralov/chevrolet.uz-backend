"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const sequelize_1 = require("sequelize");
const sequlelize_1 = require("../../config/sequlelize");
class Users extends sequelize_1.Model {
}
exports.Users = Users;
Users.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true
    },
    password: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true
    },
    isAdmin: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    profile_image: {
        type: sequelize_1.TEXT
    }
}, {
    sequelize: sequlelize_1.newSequelize,
    tableName: 'users',
    paranoid: true
});
