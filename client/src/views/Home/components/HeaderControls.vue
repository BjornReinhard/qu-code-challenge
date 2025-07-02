<script setup lang="ts">
import SortingOrderIcon from '@/components/icons/SortingOrderIcon.vue';
import { usePaginationStore } from '@/stores/usePaginationStore.ts';
import { isNumericString } from '@/utils/number.utils.ts';
import { useJokesStore } from '@/views/Home/stores/useJokesStore.ts';
import { ref } from 'vue';

defineOptions({
  name: 'QuHeaderControls',
});

const paginationStore = usePaginationStore();
const jokesStore = useJokesStore();

const jokesPerPageToSelect = [5, 10, 20, 100];
const jokesNumberToLoad = ref(jokesStore.jokesNumber);

const handleJokesNumberChange = async (value: number) => {
  await jokesStore.loadJokes(value);
};

const jokesNumberInput = ref<string>(String(jokesStore.jokesNumber));

const onJokesNumberInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  let val = target.value.replace(/\D/g, '');

  if (val) {
    const numericVal = Math.min(parseInt(val, 10), 250);
    jokesNumberInput.value = String(numericVal);
    jokesNumberToLoad.value = numericVal;
  } else {
    jokesNumberInput.value = '';
  }
};

const isLoadJokesDisabled = () => {
  return !isNumericString(jokesNumberInput.value);
};
</script>

<template>
  <nav :class="$style.container" aria-label="Joke controls">
    <div style="display: flex; align-items: center; gap: 1rem">
      <AButton type="primary" @click="jokesStore.loadJoke()">Add joke</AButton>
      <AButton type="primary" danger @click="jokesStore.resetJokes(jokesStore.jokesNumber)"
        >Reset jokes</AButton
      >
    </div>

    <div style="display: flex; align-items: center; gap: 1rem">
      <label for="jokesToLoadInput">Jokes to load:</label>
      <AInput
        v-model:value="jokesNumberInput"
        :maxLength="3"
        @input="onJokesNumberInput"
        @keydown.enter="handleJokesNumberChange(jokesNumberToLoad)"
        placeholder="Up to 250"
        style="width: 7.5rem"
        id="jokesToLoadInput"
      />
      <AButton
        type="primary"
        @click="handleJokesNumberChange(jokesNumberToLoad)"
        :disabled="isLoadJokesDisabled()"
        >Load jokes</AButton
      >
    </div>
    <div style="display: flex; align-items: center; gap: 1rem">
      <label for="jokesPerPageSelect">Jokes per page:</label>
      <ASelect
        ref="select"
        v-model:value="paginationStore.pageSize"
        style="width: 7.5rem"
        id="jokesPerPageSelect"
        aria-label="Jokes per page"
      >
        <ASelectOption
          v-for="jokesPerPage in jokesPerPageToSelect"
          :key="jokesPerPage"
          :value="jokesPerPage"
        >
          {{ jokesPerPage }}
        </ASelectOption>
      </ASelect>
      <div style="display: flex; align-items: center; gap: 0.5rem">
        <SortingOrderIcon :class="$style.sortingIcon" />
        <span id="sortByTypeLabel">Sort by joke type:</span>
      </div>
      <ASelect
        ref="select"
        v-model:value="jokesStore.sortingDirection"
        @change="jokesStore.toggleSorting"
        style="width: 7.5rem"
        aria-labelledby="sortByTypeLabel"
      >
        <ASelectOption value="ASC">Asc</ASelectOption>
        <ASelectOption value="DESC">Desc</ASelectOption>
      </ASelect>
    </div>
  </nav>
</template>

<style module>
.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 80%;
  min-height: 3.75rem;
  gap: var(--space-lg);
}

.sortingIcon:hover {
  cursor: pointer;
}

.containerWrap {
  display: flex;
}
</style>
