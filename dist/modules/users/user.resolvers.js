"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const user_model_1 = require("../../models/users/user.model");
const custom_error_1 = require("../../helpers/custom.error");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_config_1 = require("../../config/jwt.config");
const uservalidation_1 = require("../../validation/uservalidation");
const auth_validation_1 = require("../../validation/auth.validation");
const path_1 = require("path");
const fs_1 = require("fs");
const resolvers = {
    Query: {
        users: async (_, __, { authToken }) => {
            const error = (0, auth_validation_1.authValidation)(authToken);
            if (error) {
                return error;
            }
            const users = await user_model_1.Users.findAll();
            return users;
        }
    },
    Mutation: {
        login: async (_, args) => {
            const { username, password } = args.input;
            const adminUser = await user_model_1.Users.findOne({ where: { username } });
            const compare = await bcrypt_1.default.compare(String(password), String(adminUser?.dataValues.password));
            if (!compare) {
                return {
                    msg: 'failed login',
                    token: null,
                    logined: false
                };
            }
            const isAdmin = adminUser.isAdmin;
            const token = (0, jwt_config_1.sign)({ username, password, isAdmin });
            return {
                msg: 'successfully logged in',
                token: token,
                logined: true
            };
        },
        register: async (_, args) => {
            const { username, password, checkpassword } = args.input;
            const findUser = await user_model_1.Users.findOne({ where: { username } });
            if (findUser) {
                return {
                    msg: "user alredy exist",
                    registered: false
                };
            }
            const { error } = (0, uservalidation_1.validateUser)({ username, password, checkpassword });
            if (error) {
                return {
                    msg: error.details[0].message,
                    registered: false
                };
            }
            const hashPasswd = await bcrypt_1.default.hash(String(password), 6);
            const token = (0, jwt_config_1.sign)({ username, hashPasswd, isAdmin: false });
            const newUser = await user_model_1.Users.create({ username, password: hashPasswd, isAdmin: false });
            return {
                msg: 'registered',
                token: token,
                registered: true,
                user: newUser
            };
        },
        deleteUser: async (_, args, { authToken }) => {
            const { id } = args;
            const error = (0, auth_validation_1.authValidation)(authToken);
            if (error) {
                return error;
            }
            const user = await user_model_1.Users.findByPk(id);
            await user_model_1.Users.destroy({ where: { id } });
            return user;
        },
        updateUser: async (_, args, { authToken }) => {
            const { id, username } = args.updateInput;
            const error = (0, auth_validation_1.authValidation)(authToken);
            if (error) {
                return error;
            }
            const verifyToken = (0, jwt_config_1.verify)(authToken);
            const searchById = await user_model_1.Users.findByPk(id);
            if (!searchById) {
                return (0, custom_error_1.customErr)("user not found", "find error", 404);
            }
            if (searchById.username === verifyToken.username) {
                return (0, custom_error_1.customErr)('you can only make changes to your own account', 'update error', 403);
            }
            await user_model_1.Users.update({ username }, { where: { id } });
            return {
                id,
                oldUserName: searchById.username,
                newUserName: username
            };
        },
        addAdmin: async (_, { id }, { authToken }) => {
            const error = (0, auth_validation_1.authValidation)(authToken);
            if (error) {
                return error;
            }
            const findUser = await user_model_1.Users.findByPk(+id);
            if (!findUser) {
                return {
                    msg: "user not found",
                    data: null,
                    status: 404
                };
            }
            if (findUser.isAdmin == true) {
                return {
                    msg: "user not found",
                    data: null,
                    status: 404
                };
            }
            const adminRights = await user_model_1.Users.update({ isAdmin: true }, { where: { id } });
            return {
                msg: "admin right granted",
                data: adminRights,
                status: 200
            };
        },
        profileUpload: async (_, { file, id }, { authToken }) => {
            const error = (0, auth_validation_1.authValidation)(authToken);
            if (error) {
                return error;
            }
            const user = (0, jwt_config_1.verify)(authToken);
            const findUSer = await user_model_1.Users.findOne({ where: { username: user.username } });
            const checkUSer = await user_model_1.Users.findByPk(id);
            if (!checkUSer) {
                return {
                    msg: "user not found",
                    data: null,
                    status: 404
                };
            }
            if (findUSer.id != id) {
                return {
                    msg: "Only upload photos to your own account!",
                    data: null,
                    status: 404
                };
            }
            const { filename, createReadStream } = await file;
            const timestampedFilename = Date.now() + filename.replace(/\s/g, "");
            const filePath = (0, path_1.resolve)(process.cwd(), "uploads", timestampedFilename);
            const stream = createReadStream();
            const out = (0, fs_1.createWriteStream)(filePath);
            stream.pipe(out);
            await user_model_1.Users.update({ profile_image: filePath }, { where: { id } });
            return {
                msg: "upload profile image",
                data: filePath,
                status: 200
            };
        }
    }
};
exports.resolvers = resolvers;
