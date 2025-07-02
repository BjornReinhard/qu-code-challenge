import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export const usePaginationStore = defineStore('usePaginationStore', () => {
  const route = useRoute();
  const router = useRouter();
  const currentPage = computed(() => Number(route.query.page) || 1);
  const pageSize = useStorage('pageSize', 10);

  const setCurrentPage = async (pageNumber: number) => {
    await router.push({ query: { ...route.query, page: pageNumber.toString() } });
  };

  return { currentPage, setCurrentPage, pageSize };
});
