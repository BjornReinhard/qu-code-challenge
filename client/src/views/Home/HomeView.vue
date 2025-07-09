<script setup lang="ts">
import LoadingIcon from '@/components/icons/LoadingIcon.vue';
import QuLayout from '@/components/TheLayout.vue';
import QuPagination from '@/components/ThePagination.vue';
import { usePaginationStore } from '@/stores/usePaginationStore.ts';
import { wait } from '@/utils/auxiliary.utils.ts';
import QuHeaderControls from '@/views/Home/components/HeaderControls.vue';
import QuJokesGrid from '@/views/Home/components/JokesGrid.vue';
import { useJokesStore } from '@/views/Home/stores/useJokesStore.ts';
import { useAsyncState } from '@vueuse/core';
import { onMounted } from 'vue';

const paginationStore = usePaginationStore();
const jokesStore = useJokesStore();
const {
  isReady: areJokesReady,
  executeImmediate: loadJokes,
  isLoading: isJokesLoading,
} = useAsyncState(
  async () => {
    await jokesStore.loadJokes();
    await wait(1000);
  },
  undefined,
  { immediate: false },
);

onMounted(async () => {
  await loadJokes();
});
</script>

<template>
  <QuLayout>
    <template #header>
      <QuHeaderControls />
    </template>
    <template #main>
      <Transition name="fade-slide" mode="out-in" appear>
        <div
          :class="$style.loadingContainer"
          key="loader"
          v-if="isJokesLoading || jokesStore.jokesUpdating"
        >
          <LoadingIcon />
          <span>Loading...</span>
        </div>
        <QuJokesGrid v-else key="grid" />
      </Transition>
    </template>
    <template #footer>
      <Transition name="fade-slide-delayed" appear>
        <QuPagination
          v-if="areJokesReady && !isJokesLoading && !jokesStore.jokesUpdating"
          :total="jokesStore.jokesNumber"
          :model-value="paginationStore.currentPage"
          :page-size="paginationStore.pageSize"
          @page-change="paginationStore.setCurrentPage"
        />
      </Transition>
    </template>
  </QuLayout>
</template>
<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}

.fade-slide-delayed-enter-active,
.fade-slide-delayed-leave-active {
  transition:
    opacity 0.35s ease 0.8s,
    transform 0.35s ease 0.8s;
}

.fade-slide-enter-from,
.fade-slide-leave-to,
.fade-slide-delayed-enter-from,
.fade-slide-delayed-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-enter-to,
.fade-slide-leave-from,
.fade-slide-delayed-enter-to,
.fade-slide-delayed-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>

<style module>
.loadingContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: var(--space-md);
}
</style>
