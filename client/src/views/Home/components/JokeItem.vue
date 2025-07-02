<script setup lang="ts">
import RemoveJokeIcon from '@/components/icons/RemoveJokeIcon.vue';
import QuRating from '@/components/Rating.vue';
import type { Joke } from '@/models/Joke.ts';
import { ref, watch } from 'vue';

defineOptions({
  name: 'QuJokeItem',
});

const props = defineProps<{
  joke: Joke;
}>();

const emit = defineEmits<{
  (e: 'on-remove', id: number): void;
  (e: 'on-rating-set', joke: Joke): void;
}>();

const showPunchline = ref(false);
const togglePunchline = () => {
  showPunchline.value = !showPunchline.value;
};

const handleRemove = () => {
  emit('on-remove', props.joke.id);
};

watch(
  () => props.joke.rating,
  (newRating) => {
    emit('on-rating-set', { ...props.joke, rating: newRating });
  },
);
</script>

<template>
  <article :class="$style.container" aria-label="Joke item">
    <div :class="$style.itemHeader" as header>
      <span :class="$style.number">{{ joke.id }}</span>
      <RemoveJokeIcon :class="$style.removeIcon" @click="handleRemove" />
    </div>
    <section
      :class="$style.itemBody"
      @click="togglePunchline"
      aria-label="Joke setup and punchline"
    >
      <Transition name="fade" mode="out-in" appear>
        <div v-if="showPunchline" key="punchline" :class="$style.itemBodyText">
          {{ joke.punchline }}
        </div>
        <div v-else key="setup" :class="$style.itemBodyText">
          {{ joke.setup }}
        </div>
      </Transition>
    </section>
    <div :class="$style.itemFooter" as footer>
      <span :class="$style.type">
        {{ joke.type }}
      </span>
      <QuRating v-model="joke.rating" />
    </div>
  </article>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active {
  transition-delay: 0.2ms;
}
</style>

<style module>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 9rem;
}

.number {
  color: var(--text-secondary);
}

.type {
  color: var(--text-secondary);
}

.removeIcon {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.removeIcon:hover {
  transform: scale(1.2);
}

.removeIcon:active {
  transform: scale(0.95);
}

.itemHeader,
.itemFooter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 2rem;
}

.itemBody {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
  height: 100%;
  gap: var(--space-md);
  color: var(--text-primary);
}

.itemBodyText {
  display: flex;
  align-items: center;
  height: 100%;
  text-align: center;
  cursor: pointer;
  gap: var(--space-md);
  transition: all 0.2s ease;
}

.itemBodyText:hover {
  text-decoration: underline;
}
</style>
