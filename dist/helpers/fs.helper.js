"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readFile = (road) => {
    return fs_1.default.readFileSync(path_1.default.resolve(process.cwd(), `${road}`), 'utf-8');
};
exports.readFile = readFile;
