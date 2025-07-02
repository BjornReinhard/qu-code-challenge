<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name: 'QuPagination' });

const props = withDefaults(
  defineProps<{
    total: number;
    modelValue: number;
    pageSize: number;
    siblingCount?: number;
  }>(),
  {
    siblingCount: 1,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
  (e: 'page-change', value: number): void;
}>();

const totalPages = computed(() => Math.ceil(props.total / props.pageSize));
const currentPage = computed(() => Math.min(Math.max(1, props.modelValue), totalPages.value));
function goToPage(page: number) {
  const safePage = Math.min(Math.max(1, page), totalPages.value);
  emit('update:modelValue', safePage);
  emit('page-change', safePage);
}

function prev() {
  if (currentPage.value > 1) goToPage(currentPage.value - 1);
}

function next() {
  if (currentPage.value < totalPages.value) goToPage(currentPage.value + 1);
}

const visiblePages = computed(() => {
  const totalPagesValue = totalPages.value;
  const current = currentPage.value;
  const siblingCount = props.siblingCount;
  const totalNumbersToShow = 2 * siblingCount + 5;

  if (totalPagesValue <= totalNumbersToShow) {
    return Array.from({ length: totalPagesValue }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];

  const firstPage = 1;
  const lastPage = totalPagesValue;
  const leftSibling = Math.max(current - siblingCount, firstPage + 1);
  const rightSibling = Math.min(current + siblingCount, lastPage - 1);

  const shouldShowLeftDots = leftSibling > firstPage + 1;
  const shouldShowRightDots = rightSibling < lastPage - 1;

  pages.push(firstPage);

  if (shouldShowLeftDots) {
    pages.push('...');
  } else {
    for (let i = 2; i < leftSibling; i++) {
      pages.push(i);
    }
  }

  for (let i = leftSibling; i <= rightSibling; i++) {
    pages.push(i);
  }

  if (shouldShowRightDots) {
    pages.push('...');
  } else {
    for (let i = rightSibling + 1; i < lastPage; i++) {
      pages.push(i);
    }
  }

  pages.push(lastPage);

  return pages;
});
</script>

<template>
  <nav :class="$style.pagination" role="navigation" aria-label="Pagination">
    <button :class="$style.pageBtn" :disabled="currentPage <= 1" @click="prev" aria-label="Previous page">Prev</button>

    <ul style="display: flex; align-items: center; gap: 0.3rem; list-style: none; padding: 0; margin: 0;">
      <li v-for="(page, index) in visiblePages" :key="index">
        <button
          v-if="page !== '...'"
          :class="[$style.pageBtn, { [$style.active]: page === currentPage }]"
          @click="goToPage(page as number)"
          :aria-current="page === currentPage ? 'page' : undefined"
          :aria-label="'Go to page ' + page"
        >
          {{ page }}
        </button>
        <span v-else :class="$style.ellipsis" aria-hidden="true">...</span>
      </li>
    </ul>

    <button :class="$style.pageBtn" :disabled="currentPage >= totalPages" @click="next" aria-label="Next page">
      Next
    </button>
  </nav>
</template>

<style module>
.pagination {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.pageBtn {
  padding: var(--space-sm) var(--space-lg);
  border: 0.0625rem solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: var(--bg-surface);
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  transition: background 0.2s;
}

.pageBtn.active {
  background: var(--color-gray-700);
  color: var(--text-inverse);
}

.pageBtn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.ellipsis {
  padding: var(--space-sm) var(--space-lg);
  color: var(--color-gray-600);
}
</style>
