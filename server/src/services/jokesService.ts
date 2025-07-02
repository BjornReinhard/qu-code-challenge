import { Joke } from "../models/Joke";

let jokes: Joke[] = [];

export function getCachedJokes(): Joke[] {
  return jokes;
}

export function setJokes(newJokes: Joke[]): void {
  jokes = newJokes;
}

export function addJoke(joke: Joke): void {
  jokes.push(joke);
}

export function updateJoke(id: number, updated: Joke): Joke | null {
  const index = jokes.findIndex((j) => j.id === id);
  if (index !== -1) {
    jokes[index] = updated;
    return jokes[index];
  }
  return null;
}

export function deleteJoke(id: number): boolean {
  const initialLength = jokes.length;
  jokes = jokes.filter((j) => j.id !== id);
  return jokes.length < initialLength;
}

export function clearJokes(): void {
  jokes = [];
}
