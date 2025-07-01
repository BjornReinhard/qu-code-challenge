import { Joke, Rating } from "../models/Joke";

const isValidRating = (value: any): value is Rating =>
  [0, 1, 2, 3].includes(Number(value));

export function enrichJoke(joke: Partial<Joke>): Joke {
  return {
    ...joke,
    rating: isValidRating(joke.rating) ? joke.rating : 0,
  } as Joke;
}

export function enrichJokes(jokes: Partial<Joke>[]): Joke[] {
  return jokes.map(enrichJoke);
}
