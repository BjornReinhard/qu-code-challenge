import type { Joke } from '@/models/Joke.ts';
import { envService } from '@/services/env.service.ts';
import { httpService } from '@/services/http.service.ts';
import { usePaginationStore } from '@/stores/usePaginationStore.ts';
import { notifyError } from '@/utils/auxiliary.utils.ts';
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
  const jokesUpdating = ref(false);
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
    jokesUpdating.value = true;
    jokesNumber.value = value ?? jokesNumber.value;

    try {
      jokes.value = await httpService.get<Joke[]>(`/${jokesNumber.value}`);
    } catch (error) {
      notifyError(`Couldn't load jokes.`, error);
      throw error;
    } finally {
      jokesUpdating.value = false;
    }
  };

  const loadJoke = async (): Promise<Joke | undefined> => {
    let result;
    try {
      result = await httpService.get<Joke>(`/random`);
      jokes.value = [...jokes.value, result];
    } catch (error: any) {
      switch (error.status) {
        case 404:
          notifyError('Joke not found', error);
          break;
        case 409:
          notifyError("Couldn't fetch a unique joke. Try again.", error);
          break;
        case 500:
          notifyError('Server error. Please try later.', error);
          break;
        default:
          notifyError(error.message || 'Unexpected error occurred', error);
          break;
      }
      throw error;
    }
    return result;
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
      jokesUpdating.value = true;
      jokes.value = sortJokes(jokes.value);
      jokesUpdating.value = false;
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
      notifyError(`Couldn't remove jokes.`, error);
      throw error;
    }
  };

  const removeJoke = async (id: number): Promise<void> => {
    try {
      await httpService.delete(`/${id}`);
      jokes.value = jokes.value.filter((jokes) => jokes.id !== id);
    } catch (error) {
      notifyError(`Couldn't remove the joke with id ${id}`, error);
      throw error;
    }
  };

  const updateJokeRating = async (joke: Joke) => {
    try {
      await httpService.put(`/${joke.id}`, joke);
    } catch (error) {
      notifyError(`Couldn't update rating for the joke with id ${joke.id}`, error);
      throw error;
    }
  };

  const resetJokes = async (jokesNumber: number) => {
    jokesUpdating.value = true;
    try {
      jokes.value = await httpService.post(`/reset/${jokesNumber}`, {});
    } catch (error) {
      notifyError(`Couldn't reset ${jokesNumber} jokes`, error);
      throw error;
    } finally {
      jokesUpdating.value = false;
    }
  };

  return {
    jokes,
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
    jokesUpdating,
  };
});
