<script setup lang="ts">
import QuButton from '@/components/Button.vue';
import AddIcon from '@/components/icons/AddIcon.vue';
import LoadIcon from '@/components/icons/LoadIcon.vue';
import RefreshIcon from '@/components/icons/RefreshIcon.vue';
import SortingOrderIcon from '@/components/icons/SortingOrderIcon.vue';
import { toastService } from '@/services/toast.service.ts';
import { usePaginationStore } from '@/stores/usePaginationStore.ts';
import { isNumericString } from '@/utils/number.utils.ts';
import { useJokesStore } from '@/views/Home/stores/useJokesStore.ts';
import { useAsyncState } from '@vueuse/core';
import { ref } from 'vue';

defineOptions({
  name: 'QuHeaderControls',
});

const paginationStore = usePaginationStore();
const jokesStore = useJokesStore();

const jokesPerPageToSelect = [5, 10, 20, 100];
const jokesNumberToLoad = ref(jokesStore.jokesNumber);
const jokesNumberInput = ref<string>(String(jokesStore.jokesNumber));
const { isLoading: isJokesLoading, executeImmediate: loadJokes } = useAsyncState(
  async (value) => await jokesStore.loadJokes(value),
  undefined,
  {
    immediate: false,
    onSuccess: () => toastService.success(`${jokesStore.jokes.length} jokes successfully loaded.`),
  },
);
const { executeImmediate: addJoke, isLoading: isAddJokeLoading } = useAsyncState(
  async () => {
    return await jokesStore.loadJoke();
  },
  undefined,
  {
    immediate: false,
    onSuccess: (addedJoke) => {
      jokesNumberInput.value = String(jokesStore.jokesNumber);
      toastService.success(
        `A joke with id: ${addedJoke?.id} successfully added to the end of the grid.`,
      );
    },
  },
);

const {
  state,
  executeImmediate: resetJokes,
  isReady,
  isLoading: isJokesResetting,
} = useAsyncState(
  async () => {
    await jokesStore.resetJokes(jokesStore.jokesNumber);
    toastService.success(
      `${jokesStore.jokes.length} fresh jokes successfully pulled from the external API!`,
    );
  },
  undefined,
  { immediate: false },
);

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
  return (
    !isNumericString(jokesNumberInput.value) ||
    isJokesLoading.value ||
    Number(jokesNumberInput.value) === jokesStore.jokesNumber
  );
};
</script>

<template>
  <nav :class="$style.container" aria-label="Joke controls">
    <div :class="$style.controlsBlock">
      <QuButton
        type="primary"
        @click="addJoke"
        :disabled="isAddJokeLoading"
        tooltip="Add a new joke pulled from external API to the end of the grid"
      >
        <template #icon>
          <AddIcon :class="$style.icon" />
        </template>
        Add a joke
      </QuButton>
      <QuButton
        type="primary"
        danger
        @click="resetJokes"
        :disabled="isJokesResetting"
        tooltip="Reset cached jokes array on the server and pulled fresh jokes from external API"
      >
        <template #icon>
          <RefreshIcon :class="$style.icon" />
        </template>
        Reset jokes
      </QuButton>
    </div>

    <div :class="$style.controlsBlock">
      <label for="jokesToLoadInput">Jokes number:</label>
      <AInput
        v-model:value="jokesNumberInput"
        :maxLength="3"
        @input="onJokesNumberInput"
        @keydown.enter="loadJokes(jokesNumberToLoad)"
        placeholder="Up to 250"
        :class="$style.jokesToLoad"
        id="jokesToLoadInput"
      />
      <QuButton
        type="primary"
        :loading="isJokesLoading"
        @click="loadJokes(jokesNumberToLoad)"
        :disabled="isLoadJokesDisabled()"
        tooltip="Load needed number of jokes from the server. This number is cached in localStorage."
      >
        <template #icon>
          <LoadIcon :class="$style.icon" />
        </template>
        Load jokes
      </QuButton>
    </div>
    <div :class="$style.controlsBlock">
      <ATooltip
        title="Number of jokes to display per one page. This number is cached in localStorage."
      >
        <label for="jokesPerPageSelect">Jokes per page:</label>
      </ATooltip>
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
      <ATooltip title="Sort jokes by their type.">
        <span id="sortByTypeLabel">Sort jokes:</span>
      </ATooltip>
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
