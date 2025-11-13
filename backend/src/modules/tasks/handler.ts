import "reflect-metadata";
import express from "express";
import serverless from "serverless-http";
import taskRoutes from "../../routes/tasks";
import { AppDataSource } from "../../ormconfig";
import { corsMiddleware } from "../../utils/cors";

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use("/api/tasks", taskRoutes);

let isInitialized = false;

const initializeDatabase = async () => {
  if (!isInitialized) {
    try {
      await AppDataSource.initialize();
      isInitialized = true;
      console.log("Tasks Lambda: Database connected");
    } catch (error) {
      console.error(
        "Tasks Lambda: Error during Data Source initialization:",
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
