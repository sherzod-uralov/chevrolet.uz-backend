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
        model: async () => {
            const models = await carModel_model_1.Models.findAll();
            return models;
        },
    },
    Mutation: {
        createCar: async (_, { input, files }, { authToken }) => {
            const { category, toning, engine, year, color, distance, gearbook, category_id, inside_image, outside_image, model_type_image, price } = input;
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
            if (!inside_image || !outside_image || !model_type_image) {
                return {
                    msg: "hamma rasmlarni yuklang",
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
            const newCar = await carModel_model_1.Models.create({
                category,
                toning,
                engine,
                year,
                color,
                distance,
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
            const { category, toning, engine, year, color, distance, gearbook, inside_image, outside_image, model_type_image, price } = input;
            const error = (0, auth_validation_1.authValidation)(authToken);
            if (error) {
                return error;
            }
            if (!inside_image || !outside_image || !model_type_image) {
                return {
                    msg: "hamma rasmlarni yuklang",
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
            const newCar = await carModel_model_1.Models.update({
                category,
                toning,
                engine,
                year,
                color,
                distance,
                gearbook,
                inside_image: arrF[0],
                outside_image: arrF[1],
                model_type_image: arrF[2],
                price
            }, {
                where: {
                    model_id: id
                }
            });
            return {
                mag: `${arrF.length}-ta file yangilandi`,
                data: newCar,
                status: 200
            };
        },
        deleteCar: async (_, { id }) => {
            const deleteCar = await carModel_model_1.Models.destroy({ where: { model_id: id } });
            if (deleteCar == 0) {
                return {
                    msg: "carmodel not found",
                    data: null,
                    status: 404
                };
            }
            return {
                msg: "carmodel deleted",
                data: deleteCar,
                status: 200
            };
        }
    },
    Upload: graphql_upload_ts_1.GraphQLUpload
};
exports.resolvers = resolvers;
