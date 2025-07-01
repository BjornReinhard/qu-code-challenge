import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jokeRoutes from "./routes/jokeRoutes";

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api/jokes", jokeRoutes);

export default app;
