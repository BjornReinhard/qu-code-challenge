import { Router } from "express";
import {
  deleteAllJokes,
  deleteJokeById,
  getJokes,
  loadRandomJoke,
  postJoke,
  putJoke,
  resetJokes,
} from "../controllers/jokeController";

const router = Router();

router.get("/random", loadRandomJoke);
router.get("/:count", getJokes);

router.post("/", postJoke);
router.put("/:id", putJoke);
router.post("/reset/:count", resetJokes);

router.delete("/:id", deleteJokeById);
router.delete("/", deleteAllJokes);

export default router;
