<script setup lang="ts">
import QuButton from '@/components/Button.vue';
import AddIcon from '@/components/icons/AddIcon.vue';
import LoadIcon from '@/components/icons/LoadIcon.vue';
import RefreshIcon from '@/components/icons/RefreshIcon.vue';
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
const jokesNumberInput = ref<string>(String(jokesStore.jokesNumber));

const handleJokesNumberChange = async (value: number) => {
  await jokesStore.loadJokes(value);
};

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
    <div :class="$style.controlsBlock">
      <QuButton type="primary" @click="jokesStore.loadJoke()">
        <template #icon>
          <AddIcon :class="$style.icon" />
        </template>
        Add a joke
      </QuButton>
      <QuButton type="primary" danger @click="jokesStore.resetJokes(jokesStore.jokesNumber)">
        <template #icon>
          <RefreshIcon :class="$style.icon" />
        </template>
        Reset jokes
      </QuButton>
    </div>

    <div :class="$style.controlsBlock">
      <label for="jokesToLoadInput">Jokes to load:</label>
      <AInput
        v-model:value="jokesNumberInput"
        :maxLength="3"
        @input="onJokesNumberInput"
        @keydown.enter="handleJokesNumberChange(jokesNumberToLoad)"
        placeholder="Up to 250"
        :class="$style.jokesToLoad"
        id="jokesToLoadInput"
      />
      <QuButton
        type="primary"
        @click="handleJokesNumberChange(jokesNumberToLoad)"
        :disabled="isLoadJokesDisabled()"
      >
        <template #icon>
          <LoadIcon :class="$style.icon" />
        </template>
        Load jokes
      </QuButton>
    </div>
    <div :class="$style.controlsBlock">
      <label for="jokesPerPageSelect">Jokes per page:</label>
      <ASelect
        ref="select"
        v-model:value="paginationStore.pageSize"
        :class="$style.jokesPerPage"
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
    </div>
    <div :class="$style.controlsBlock">
      <span id="sortByTypeLabel">Sort by joke type:</span>
      <ASelect
        ref="select"
        v-model:value="jokesStore.sortingDirection"
        @change="jokesStore.toggleSorting"
        :class="$style.sortingSelect"
        aria-labelledby="sortByTypeLabel"
      >
        <template #suffixIcon>
          <SortingOrderIcon :class="$style.sortingIcon" />
        </template>
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
  width: 100%;
  gap: var(--space-lg);
  padding: var(--space-lg);
}

.controlsBlock {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.jokesToLoad {
  width: 4.5rem;
}

.jokesPerPage {
  width: 5rem;
}

.sortingSelect {
  width: 5.5rem;
}

@media (max-width: 43.75rem) {
  .container {
    width: 100%;
  }
}

.sortingIcon:hover {
  cursor: pointer;
}

.icon {
  path {
    fill: var(--color-white);
  }
}
</style>
