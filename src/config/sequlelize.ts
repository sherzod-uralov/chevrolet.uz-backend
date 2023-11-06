import { Sequelize } from "sequelize";


const newSequelize = new Sequelize({
    dialect:'postgres',
    database:'car',
    host:'localhost',  
    port:5432,
    logging:false,
    username:'postgres'
})

export {newSequelize}