import type { Joke } from '@/models/Joke.ts';
import { httpService } from '@/services/http.service.ts';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useJokesStore } from './useJokesStore';

vi.mock('@/services/http.service.ts', () => ({
  httpService: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));
vi.mock('@/services/env.service.ts', () => ({
  envService: { TOTAL_JOKES_NUMBER: 10 },
}));
vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {} }),
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));
vi.mock('@vueuse/core', () => ({
  useStorage: (key: string, defaultValue: any) => {
    let val = defaultValue;
    return {
      get value() {
        return val;
      },
      set value(v) {
        val = v;
      },
    };
  },
}));

const jokeA: Joke = { id: 1, type: 'a', setup: '', punchline: '', rating: 0 };
const jokeB: Joke = { id: 2, type: 'b', setup: '', punchline: '', rating: 2 };

describe('useJokesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('loads jokes and updates state', async () => {
    vi.mocked(httpService.get).mockResolvedValue([jokeA]);
    const store = useJokesStore();
    await store.loadJokes(1);
    // @ts-expect-error: jokesNumber is a ref in test context
    expect(store.jokesNumber.value).toBe(1);
    expect(store.jokes).toEqual([jokeA]);
    expect(httpService.get).toHaveBeenCalledWith('/1');
  });

  it('loads a single joke and appends to jokes', async () => {
    vi.mocked(httpService.get).mockResolvedValue([]);
    const store = useJokesStore();
    await store.loadJokes();
    vi.mocked(httpService.get).mockResolvedValue(jokeB);
    await store.loadJoke();
    expect(store.jokes).toEqual([jokeB]);
    expect(httpService.get).toHaveBeenCalledWith('/random');
  });

  it('removes a joke by id', async () => {
    vi.mocked(httpService.get).mockResolvedValue([jokeA]);
    vi.mocked(httpService.delete).mockResolvedValue();
    const store = useJokesStore();
    await store.loadJokes(1);
    await store.removeJoke(jokeA.id);
    expect(store.jokes).toEqual([]);
    expect(httpService.delete).toHaveBeenCalledWith('/1');
  });

  it('removes all jokes', async () => {
    vi.mocked(httpService.get).mockResolvedValue([jokeA]);
    vi.mocked(httpService.delete).mockResolvedValue();
    const store = useJokesStore();
    await store.loadJokes(1);
    await store.removeJokes();
    expect(store.jokes).toEqual([]);
    expect(httpService.delete).toHaveBeenCalledWith('/');
  });

  it('updates joke rating', async () => {
    vi.mocked(httpService.put).mockResolvedValue({});
    const store = useJokesStore();
    await store.updateJokeRating(jokeB);
    expect(httpService.put).toHaveBeenCalledWith('/2', jokeB);
  });

  it('resets jokes', async () => {
    vi.mocked(httpService.post).mockResolvedValue([jokeA]);
    const store = useJokesStore();
    await store.resetJokes(1);
    await store.loadJokes();
    expect(store.jokes).toEqual([jokeA]);
    expect(httpService.post).toHaveBeenCalledWith('/reset/1', {});
  });

  it('sorts jokes ascending and descending', async () => {
    vi.mocked(httpService.get).mockResolvedValue([jokeB, jokeA]);
    const store = useJokesStore();
    await store.loadJokes(2);
    store.sortingDirection = 'ASC';
    store.toggleSorting();
    expect(store.jokes[0].type).toBe('a');
    store.sortingDirection = 'DESC';
    store.toggleSorting();
    expect(store.jokes[0].type).toBe('b');
  });

  it('paginates array correctly', () => {
    const store = useJokesStore();
    const arr: Joke[] = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      type: 'a',
      setup: '',
      punchline: '',
      rating: 0,
    }));
    const page = store.paginateArray(arr, 2, 3);
    expect(page.length).toBe(3);
    expect(page[0].id).toBe(3);
  });

  it('handles errors gracefully in async actions', async () => {
    vi.mocked(httpService.get).mockRejectedValue(new Error('Expected test error'));
    const store = useJokesStore();
    await expect(store.loadJokes(1)).rejects.toThrow('Expected test error');
    await expect(store.loadJoke()).rejects.toThrow('Expected test error');
    vi.mocked(httpService.delete).mockRejectedValue(new Error('Expected test error'));
    await expect(store.removeJoke(1)).rejects.toThrow('Expected test error');
    await expect(store.removeJokes()).rejects.toThrow('Expected test error');
    vi.mocked(httpService.put).mockRejectedValue(new Error('Expected test error'));
    await expect(store.updateJokeRating(jokeA)).rejects.toThrow('Expected test error');
    vi.mocked(httpService.post).mockRejectedValue(new Error('Expected test error'));
    await expect(store.resetJokes(1)).rejects.toThrow('Expected test error');
  });
});
