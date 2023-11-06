"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newSequelize = void 0;
const sequelize_1 = require("sequelize");
const newSequelize = new sequelize_1.Sequelize({
    dialect: 'postgres',
    database: 'car',
    host: 'localhost',
    port: 5432,
    logging: false,
    username: 'postgres'
});
exports.newSequelize = newSequelize;
