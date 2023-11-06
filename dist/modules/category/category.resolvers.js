"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const auth_validation_1 = require("../../validation/auth.validation");
const fs_1 = require("fs");
const path_1 = require("path");
const graphql_upload_ts_1 = require("graphql-upload-ts");
const category_model_1 = require("../../models/category/category.model");
const carModel_model_1 = require("../../models/madels/carModel.model");
const resolvers = {
    Query: {
        category: async () => {
            const category = await category_model_1.Category.findAll({
                include: carModel_model_1.models
            });
            return category;
        }
    },
    Mutation: {
        creatCategory: async (_, { input, file }, { authToken }) => {
            const { category_name } = input;
            const error = (0, auth_validation_1.authValidation)(authToken);
            if (error) {
                return error;
            }
            const checkCategory = await category_model_1.Category.findOne({ where: { category_name } });
            if (checkCategory) {
                return {
                    msg: "such a category exists",
                    status: 400
                };
            }
            if (!file) {
                return {
                    msg: "enter the fie!",
                    status: 400
                };
            }
            const { filename, createReadStream } = await file;
            const timestampedFilename = Date.now() + filename.replace(/\s/g, "");
            const filePath = (0, path_1.resolve)("uploads", timestampedFilename);
            const stream = createReadStream();
            const out = (0, fs_1.createWriteStream)(filePath);
            stream.pipe(out);
            const newCategory = await category_model_1.Category.create({
                category_name,
                category_image: timestampedFilename
            });
            return {
                msg: "created category",
                data: newCategory,
                status: 200
            };
        },
        updateCategory: async (_, { input, file }, { authToken }) => {
            const { category_id, category_name } = input;
            const error = (0, auth_validation_1.authValidation)(authToken);
            if (error) {
                return error;
            }
            const categoryFind = await category_model_1.Category.findOne({ where: { category_id } });
            if (!categoryFind) {
                return {
                    msg: "category not found",
                    status: 400
                };
            }
            if (!file) {
                return {
                    msg: "enter the fie!",
                    status: 400
                };
            }
            const { filename, createReadStream } = await file;
            const timestampedFilename = Date.now() + filename.replace(/\s/g, "");
            console.log(timestampedFilename);
            const filePath = (0, path_1.resolve)(process.cwd(), "uploads", timestampedFilename);
            const stream = createReadStream();
            const out = (0, fs_1.createWriteStream)(filePath);
            stream.pipe(out);
            const newCategory = await category_model_1.Category.update({
                category_name,
                category_image: "uploads/" + timestampedFilename
            }, {
                where: { category_id }
            });
            return {
                msg: "created category",
                data: newCategory,
                status: 200
            };
        },
        deleteCategory: async (_, { id }, { authToken }) => {
            const error = (0, auth_validation_1.authValidation)(authToken);
            if (error) {
                return error;
            }
            const checkCategory = await category_model_1.Category.destroy({ where: { category_id: id } });
            if (checkCategory == 0) {
                return {
                    msg: "category not found",
                    data: null,
                    status: 404
                };
            }
            return {
                msg: "deleted category",
                data: checkCategory,
                status: 200
            };
        },
        categoryPagination: async (_, { limit, offset }) => {
            const limitedData = await category_model_1.Category.findAll({
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
    Upload: graphql_upload_ts_1.GraphQLUpload,
};
exports.resolvers = resolvers;
