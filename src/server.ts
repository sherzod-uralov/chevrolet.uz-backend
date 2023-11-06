import { ApolloServer } from '@apollo/server';
import cors from 'cors';
import { createServer } from 'http';
import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import schema from "./modules/index";
import { newSequelize } from "./config/sequlelize";
import { graphqlUploadExpress } from 'graphql-upload-ts';
import path from 'path';


const app = express();
const httpServer = createServer(app);

!async function() {

  const server = new ApolloServer({
    schema,
    csrfPrevention: false,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  });
  
  await server.start();

  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 3 }),
    cors<cors.CorsRequest>({
      origin:"http://localhost:5173",
      credentials:true
    }),
    express.json(),   
    expressMiddleware(server, {
      context: async ({req}):Promise<contextType> => {
        return ({
          authToken:req.headers.token
        })
      }
    })
  );

  try {
    await newSequelize.authenticate();
    await newSequelize.sync({ alter: true });  
    console.log("Database connection successful");
  } catch (error) {  
    console.error("Unable to connect to the database:", error);
  }   

  const PORT = process.env.PORT || 3700

  await new Promise<void>((resolve) =>
    httpServer.listen({ port:PORT }, resolve)
  );

  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}();
