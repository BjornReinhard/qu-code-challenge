export type Rating = 0 | 1 | 2 | 3;
export interface Joke {
  id: number;
  type: string;
  setup: string;
  punchline: string;
  rating: Rating;
}
