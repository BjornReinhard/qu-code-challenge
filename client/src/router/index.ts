import { usePaginationStore } from '@/stores/usePaginationStore.ts';
import { useJokesStore } from '@/views/Home/stores/useJokesStore.ts';
import { createRouter, createWebHistory, useRoute } from 'vue-router';
import HomeView from '../views/Home/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: async (to, from, next) => {
        const paginationStore = usePaginationStore();
        const jokesStore = useJokesStore();
        const pagesNumber = Math.ceil(jokesStore.jokesNumber / paginationStore.pageSize);
        const route = useRoute();
        if (to.query.page === undefined || parseInt(to.query.page as string) > pagesNumber) {
          await router.replace({ query: { ...route.query, page: '1' } });
        }
        next();
      },
    },
  ],
});

export default router;
