import { Request, Response } from "express";
import {
  addJoke,
  clearJokes,
  deleteJoke,
  getCachedJokes,
  setJokes,
  updateJoke,
} from "../services/jokesService";
import { enrichJoke, enrichJokes } from "../utils/enrichJoke";

/**
 * GET /api/jokes/:count?
 *
 * Retrieves a specified number of jokes from memory or fetches more from the external API as needed.
 * - If the current cached jokes are fewer than requested, it fetches only the missing amount.
 * - If the cached jokes are more than needed, it trims the array.
 * - If the cache is enough and matches the count, returns cached jokes.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns {void} Sends 200 response with a joke array or 500 on external API failure
 */
export async function getJokes(req: Request, res: Response): Promise<void> {
  const count = parseInt(
    req.params.count || process.env.DEFAULT_JOKES_NUMBER || "10",
  );
  let jokes = getCachedJokes();

  try {
    if (jokes.length < count) {
      const needed = count - jokes.length;

      const response = await fetch(
        `${process.env.JOKE_API_BASE_URL}/jokes/random/${needed}`,
      );
      const fetched = await response.json();
      const enriched = enrichJokes(fetched);

      const existingIds = new Set(jokes.map((j) => j.id));
      const newUniqueJokes = enriched.filter(
        (joke) => !existingIds.has(joke.id),
      );

      jokes = [...jokes, ...newUniqueJokes];
      setJokes(jokes);
    } else if (jokes.length > count) {
      jokes = jokes.slice(0, count);
      setJokes(jokes);
    }

    res.status(200).json(jokes);
  } catch (error) {
    console.error("Error fetching jokes:", error);
    res.status(500).json({ error: "Failed to fetch jokes from external API" });
  }
}

/**
 * GET /api/jokes/random
 *
 * Fetches one random joke and adds it to the cache if not already present.
 * Retries up to 10 times to get a unique joke by ID.
 *
 * @param req - Express request object
 * @param res - Express response object
 */
export async function loadRandomJoke(
  req: Request,
  res: Response,
): Promise<void> {
  const jokes = getCachedJokes();
  const existingIds = new Set(jokes.map((j) => j.id));

  const maxAttempts = 10;
  let attempt = 0;
  let uniqueJoke = null;

  while (attempt < maxAttempts) {
    try {
      const response = await fetch(
        `${process.env.JOKE_API_BASE_URL}/jokes/random/1`,
      );
      const fetched = await response.json();
      const enriched = enrichJoke(fetched[0]);

      if (!existingIds.has(enriched.id)) {
        uniqueJoke = enriched;
        break;
      }

      attempt++;
    } catch (error) {
      console.error("Error fetching joke:", error);
      res.status(500).json({ error: "Failed to fetch joke from external API" });
      return;
    }
  }

  if (!uniqueJoke) {
    res
      .status(409)
      .json({ error: "Could not fetch a unique joke after multiple attempts" });
    return;
  }

  const updatedJokes = [...jokes, uniqueJoke];
  setJokes(updatedJokes);
  res.status(201).json(uniqueJoke);
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
 * @param req - Express request object
 * @param res - Express response object
 * @returns 204 No Content
 */
export function deleteAllJokes(req: Request, res: Response): void {
  clearJokes();
  res.status(204).end();
}

/**
 * POST /api/jokes/reset/:count?
 *
 * Clears the current joke cache and loads fresh jokes from the external API.
 * - Uses `count` param or `DEFAULT_JOKES_NUMBER` from env as the number of jokes to fetch.
 * - Replaces the entire `cachedJokes` array.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns {void} 200 with newly loaded jokes or 500 on failure
 */
export async function resetJokes(req: Request, res: Response): Promise<void> {
  const count = parseInt(
    req.params.count || process.env.DEFAULT_JOKES_NUMBER || "10",
  );

  try {
    const response = await fetch(
      `${process.env.JOKE_API_BASE_URL}/jokes/random/${count}`,
    );
    const fetched = await response.json();
    const enriched = enrichJokes(fetched);
    setJokes(enriched);
    res.status(200).json(enriched);
  } catch (error) {
    console.error("Failed to reset jokes:", error);
    res.status(500).json({ error: "Failed to reset jokes from external API" });
  }
}
