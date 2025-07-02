<script setup lang="ts">
import QuAppLayout from '@/components/AppLayout.vue';
import QuPagination from '@/components/BasicPagination.vue';
import { usePaginationStore } from '@/stores/usePaginationStore.ts';
import QuHeaderControls from '@/views/Home/components/HeaderControls.vue';
import QuJokesGrid from '@/views/Home/components/JokesGrid.vue';
import { useJokesStore } from '@/views/Home/stores/useJokesStore.ts';
import { onMounted } from 'vue';

const paginationStore = usePaginationStore();
const jokesStore = useJokesStore();

onMounted(async () => {
  await jokesStore.loadJokes();
});

const handlePageChange = (newPage: number) => {
  paginationStore.setCurrentPage(newPage);
};
</script>

<template>
  <QuAppLayout>
    <template #header>
      <QuHeaderControls />
    </template>
    <template #main>
      <QuJokesGrid />
    </template>
    <template #footer>
      <QuPagination
        :total="jokesStore.jokesNumber"
        :model-value="paginationStore.currentPage"
        :page-size="paginationStore.pageSize"
        @page-change="handlePageChange"
      />
    </template>
  </QuAppLayout>
</template>
