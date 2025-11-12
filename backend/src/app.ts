import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./ormconfig";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const startServer = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Database connected");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error during Data Source initialization:", error);
        process.exit(1);
    }
};

startServer();
