import { Router } from "express";
import {
  deleteAllJokes,
  deleteJokeById,
  getJokes,
  postJoke,
  putJoke,
} from "../controllers/jokeController";

const router = Router();

router.get("/", getJokes);
router.post("/", postJoke);
router.put("/:id", putJoke);
router.delete("/:id", deleteJokeById);
router.delete("/", deleteAllJokes);

export default router;
