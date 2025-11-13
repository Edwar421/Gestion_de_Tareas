import "reflect-metadata";
import express from "express";
import serverless from "serverless-http";
import authRoutes from "../../routes/auth";
import { AppDataSource } from "../../ormconfig";
import { corsMiddleware } from "../../utils/cors";

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use("/api/auth", authRoutes);

let isInitialized = false;

const initializeDatabase = async () => {
  if (!isInitialized) {
    try {
      await AppDataSource.initialize();
      isInitialized = true;
      console.log("Auth Lambda: Database connected");
    } catch (error) {
      console.error(
        "Auth Lambda: Error during Data Source initialization:",
        error
      );
      throw error;
    }
  }
};

const serverlessHandler = serverless(app);

export const handler = async (event: any, context: any) => {
  await initializeDatabase();
  return serverlessHandler(event, context);
};
