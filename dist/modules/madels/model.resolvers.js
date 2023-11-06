"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const carModel_model_1 = require("../../models/madels/carModel.model");
const auth_validation_1 = require("../../validation/auth.validation");
const fs_1 = require("fs");
const path_1 = require("path");
const graphql_upload_ts_1 = require("graphql-upload-ts");
const category_model_1 = require("../../models/category/category.model");
const resolvers = {
    Query: {
        models: async () => {
            const models = await carModel_model_1.models.findAll();
            return models;
        },
    },
    Mutation: {
        createCar: async (_, { input, files }, { authToken }) => {
            const { name, toning, engine, year, color, distance, gearbook, category_id, price } = input;
            const error = (0, auth_validation_1.authValidation)(authToken);
            if (error) {
                return error;
            }
            const catecory = await category_model_1.Category.findByPk(category_id);
            if (!catecory) {
                return {
                    msg: "tanlagan categoryingiz mavjud emas",
                    status: 400
                };
            }
            const arrF = [];
            for (const file of files) {
                const { filename, createReadStream } = await file;
                const timestampedFilename = Date.now() + filename.replace(/\s/g, "");
                const filePath = (0, path_1.resolve)(process.cwd(), "uploads", timestampedFilename);
                const stream = createReadStream();
                const out = (0, fs_1.createWriteStream)(filePath);
                stream.pipe(out);
                arrF.push(filePath);
            }
            const newCar = await carModel_model_1.models.create({
                name,
                toning,
                engine,
                year,
                color,
                distance,
                category_id,
                gearbook,
                inside_image: arrF[0],
                outside_image: arrF[1],
                model_type_image: arrF[2],
                price
            });
            return {
                mag: `${arrF.length}-ta file yuklandi`,
                data: newCar,
                status: 200
            };
        },
        updateCar: async (_, { input, files, id }, { authToken }) => {
            const { name, toning, engine, year, color, category_id, distance, gearbook, price } = input;
            const error = (0, auth_validation_1.authValidation)(authToken);
            if (error) {
                return error;
            }
            const arrUpdate = [];
            for (const file of files) {
                const { filename, createReadStream } = await file;
                const timestampedFilename = Date.now() + filename.replace(/\s/g, "");
                const filePath = (0, path_1.resolve)(process.cwd(), "uploads", timestampedFilename);
                const stream = createReadStream();
                const out = (0, fs_1.createWriteStream)(filePath);
                stream.pipe(out);
                arrUpdate.push(filePath);
            }
            const newCar = await carModel_model_1.models.update({
                name,
                toning,
                engine,
                year,
                color,
                distance,
                gearbook,
                category_id,
                inside_image: arrUpdate[0],
                outside_image: arrUpdate[1],
                model_type_image: arrUpdate[2],
                price
            }, {
                where: {
                    model_id: id
                }
            });
            return {
                mag: `${arrUpdate.length}-ta file yangilandi`,
                data: newCar,
                status: 200
            };
        },
        carPagination: async (_, { limit, offset }) => {
            const limitedData = await carModel_model_1.models.findAll({
                limit: limit,
                offset: offset
            });
            return {
                msg: "ok",
                data: limitedData,
                status: 200
            };
        }
    },
    Upload: graphql_upload_ts_1.GraphQLUpload
};
exports.resolvers = resolvers;
