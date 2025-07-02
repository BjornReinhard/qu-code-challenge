import type { Joke } from '@/models/Joke.ts';
import { envService } from '@/services/env.service.ts';
import { httpService } from '@/services/http.service.ts';
import { usePaginationStore } from '@/stores/usePaginationStore.ts';
import { safeNumber } from '@/utils/number.utils.ts';
import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export const useJokesStore = defineStore('useJokesStore', () => {
  const sortingDirection = ref<'ASC' | 'DESC'>('ASC');
  const paginationStore = usePaginationStore();
  const jokes = ref<Joke[]>([]);
  const jokesPerPage = ref<Joke[]>([]);
  const jokesNumber = useStorage(
    'jokesNumber',
    envService.TOTAL_JOKES_NUMBER ? parseInt(envService.TOTAL_JOKES_NUMBER as string) : 10,
  );
  const totalPages = computed(() => {
    return Math.ceil(jokesNumber.value / paginationStore.pageSize);
  });
  const route = useRoute();
  const router = useRouter();

  watch(
    () => jokes.value.length,
    () => {
      jokesNumber.value = jokes.value.length > 0 ? jokes.value.length : jokesNumber.value;
    },
  );

  const loadJokes = async (value?: number): Promise<void> => {
    try {
      jokesNumber.value = value ?? jokesNumber.value;
      jokes.value = await httpService.get<Joke[]>(`/${jokesNumber.value}`);
    } catch (error) {
      console.error(error);
    }
  };

  const loadJoke = async (): Promise<void> => {
    try {
      const result = await httpService.get<Joke>(`/random`);
      jokes.value = [...jokes.value, result];
    } catch (error: any) {
      switch (error.status) {
        case 404:
          console.error('Joke not found');
          break;
        case 409:
          console.error("Couldn't fetch a unique joke. Try again.");
          break;
        case 500:
          console.error('Server error. Please try later.');
          break;
        default:
          console.error(error.message || 'Unexpected error occurred');
          break;
      }
    }
  };

  watch(
    [() => paginationStore.currentPage, () => paginationStore.pageSize],
    async ([currentPage, pageSize]) => {
      if (jokes.value.length > 0) {
        jokesPerPage.value = paginateArray(jokes.value, currentPage, pageSize);
      }

      if (totalPages.value < safeNumber(route.query.page as string)) {
        await router.replace({ query: { ...route.query, page: '1' } });
      }
    },
  );

  watch(
    () => jokes.value,
    async (newValue) => {
      if (newValue === undefined) {
        jokesPerPage.value = [];
        return;
      }

      if (totalPages.value < safeNumber(route.query.page as string)) {
        await router.replace({ query: { ...route.query, page: '1' } });
      }

      jokesPerPage.value = paginateArray(
        newValue,
        paginationStore.currentPage,
        paginationStore.pageSize,
      );
    },
    {
      deep: true,
    },
  );

  const sortJokes = (jokesToSort: Joke[]) => {
    const result = [...jokesToSort];
    if (sortingDirection.value === 'ASC') {
      result.sort((a, b) => a.type.localeCompare(b.type));
    } else {
      result.sort((a, b) => b.type.localeCompare(a.type));
    }

    return result;
  };

  const toggleSorting = () => {
    if (jokes.value !== undefined) {
      jokes.value = sortJokes(jokes.value);
    }
  };

  const paginateArray = <T>(items: T[], currentPage: number, pageSize: number): T[] => {
    const validPage = Math.max(1, currentPage);
    const start = (validPage - 1) * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  };

  const removeJokes = async () => {
    try {
      await httpService.delete(`/`);
      jokes.value = [];
    } catch (error) {
      console.error(error);
    }
  };

  const removeJoke = async (id: number): Promise<void> => {
    try {
      await httpService.delete(`/${id}`);
      jokes.value = jokes.value.filter((jokes) => jokes.id !== id);
    } catch (error) {
      console.error(error);
    }
  };

  const updateJokeRating = async (joke: Joke) => {
    try {
      await httpService.put(`/${joke.id}`, joke);
    } catch (error) {
      console.error(error);
    }
  };

  const resetJokes = async (jokesNumber: number) => {
    try {
      jokes.value = await httpService.post(`/reset/${jokesNumber}`, {});
    } catch (error) {
      console.error(error);
    }
  };

  return {
    loadJoke,
    removeJoke,
    removeJokes,
    jokesPerPage,
    loadJokes,
    sortingDirection,
    toggleSorting,
    paginateArray,
    jokesNumber,
    updateJokeRating,
    resetJokes,
  };
});
