import { Request, Response } from "express";
import {
  addJoke,
  clearJokes,
  deleteJoke,
  getAllJokes,
  setJokes,
  updateJoke,
} from "../services/jokesService";
import { enrichJoke, enrichJokes } from "../utils/enrichJoke";

/**
 * GET /api/jokes
 *
 * Retrieves all jokes from memory. If no jokes are loaded yet,
 * it fetches them from the external Joke API and stores them locally (in memory).
 *
 * @param req - Express request object (supports optional ?count query param)
 * @param res - Express response object
 * @returns 200 with a joke array or 500 if fetch fails
 */
export async function getJokes(req: Request, res: Response): Promise<void> {
  const count = parseInt(
    (req.query.count as string) || process.env.DEFAULT_JOKES_NUMBER || "10",
  );
  const cachedJokes = getAllJokes();

  const shouldFetch = cachedJokes.length === 0 || cachedJokes.length !== count;
  if (!shouldFetch) {
    res.status(200).json(cachedJokes);
    return;
  }

  try {
    const response = await fetch(
      `${process.env.JOKE_API_BASE_URL}/jokes/random/${count}`,
    );
    const fetched = await response.json();
    const enriched = enrichJokes(fetched);
    setJokes(enriched);
    res.status(200).json(enriched);
  } catch (error) {
    console.error("Error fetching jokes:", error);
    res.status(500).json({ error: "Failed to fetch jokes from external API" });
  }
}

/**
 * POST /api/jokes
 *
 * Adds a new joke to memory. Validates the presence of `id` and enriches joke with default properties.
 *
 * @param req - Express request object with joke in body
 * @param res - Express response object
 * @returns 201 with the newly added joke or 400 on validation error
 */
export function postJoke(req: Request, res: Response): void | Promise<void> {
  const joke = enrichJoke(req.body);
  if (!joke.id) {
    res.status(400).json({ error: "Missing joke ID" });
    return;
  }

  addJoke(joke);
  res.status(201).json(joke);
}

/**
 * PUT /api/jokes/:id
 *
 * Updates an existing joke by ID. Merges new properties with existing joke.
 *
 * @param req - Express request object with updated fields in body
 * @param res - Express response object
 * @returns 200 with updated a joke or 404 if not found
 */
export function putJoke(req: Request, res: Response): void {
  const id = Number(req.params.id);
  const updated = enrichJoke({ id, ...req.body });
  const result = updateJoke(id, updated);

  if (result) {
    res.json(result);
    return;
  }
  res.status(404).json({ error: "Joke not found" });
}

/**
 * DELETE /api/jokes/:id
 *
 * Deletes a single joke by ID from memory.
 *
 * @param req - Express request object with ID in params
 * @param res - Express response object
 * @returns 204 on successful deletion or 404 if not found
 */
export function deleteJokeById(req: Request, res: Response) {
  const id = Number(req.params.id);
  const deleted = deleteJoke(id);
  if (deleted) {
    res.status(204).end();
    return;
  }
  res.status(404).json({ error: "Joke not found" });
}

/**
 * DELETE /api/jokes
 *
 * Clears all jokes from memory.
 *
 * @param _req - Express request object (unused)
 * @param res - Express response object
 * @returns 204 No Content
 */
export function deleteAllJokes(_req: Request, res: Response): void {
  clearJokes();
  res.status(204).end();
}
