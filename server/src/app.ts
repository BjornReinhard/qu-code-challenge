import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import jokeRoutes from "./routes/jokeRoutes";

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/README.html"));
});

app.use("/api/jokes", jokeRoutes);

export default app;
