"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const index_1 = __importDefault(require("./modules/index"));
const sequlelize_1 = require("./config/sequlelize");
const graphql_upload_ts_1 = require("graphql-upload-ts");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
!async function () {
    const server = new server_1.ApolloServer({
        schema: index_1.default,
        csrfPrevention: false,
        plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })]
    });
    await server.start();
    app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
    app.use('/graphql', (0, graphql_upload_ts_1.graphqlUploadExpress)({ maxFileSize: 1000000, maxFiles: 3 }), (0, cors_1.default)({
        origin: "http://localhost:5173",
        credentials: true
    }), express_1.default.json(), (0, express4_1.expressMiddleware)(server, {
        context: async ({ req }) => {
            return ({
                authToken: req.headers.token
            });
        }
    }));
    try {
        await sequlelize_1.newSequelize.authenticate();
        await sequlelize_1.newSequelize.sync({ alter: true });
        console.log("Database connection successful");
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
    const PORT = process.env.PORT || 3700;
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}();
