<script setup lang="ts">
import QuGridItem from '@/components/GridItems/GridItem.vue';
import QuGridItems from '@/components/GridItems/GridItems.vue';
import QuJokeItem from '@/views/Home/components/JokeItem.vue';
import { useJokesStore } from '@/views/Home/stores/useJokesStore.ts';

defineOptions({
  name: 'QuJokesGrid',
});

const jokesStore = useJokesStore();
</script>

<template>
  <section :class="$style.content" aria-label="Jokes grid">
    <QuGridItems>
      <QuGridItem
        v-for="(joke, index) in jokesStore.jokesPerPage"
        :key="joke.id"
        :style="{ '--i': index }"
      >
        <QuJokeItem
          :joke="joke"
          @on-remove="(id) => jokesStore.removeJoke(id)"
          @on-rating-set="(joke) => jokesStore.updateJokeRating(joke)"
        />
      </QuGridItem>
    </QuGridItems>
  </section>
</template>

<style module>
.content {
  width: 80%;
}

@media (max-width: 43.75rem) {
  .content {
    width: 100%;
  }
}
</style>
