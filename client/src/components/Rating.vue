<script setup lang="ts">
import StarFilledIcon from '@/components/icons/StarFilledIcon.vue';
import StarOutlinedIcon from '@/components/icons/StarOutlinedIcon.vue';
import { ref, watch } from 'vue';

defineOptions({
  name: 'QuRating',
});

const props = defineProps<{
  modelValue: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const rating = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    rating.value = newVal;
  },
);

function handleClick(index: number) {
  rating.value = rating.value === index ? 0 : index;
  emit('update:modelValue', rating.value);
}
</script>

<template>
  <div :class="$style.rating" role="radiogroup" aria-label="Joke rating">
    <button
      v-for="index in 3"
      :key="index"
      :class="$style.star"
      :aria-checked="rating === index"
      role="radio"
      @click="handleClick(index)"
    >
      <span v-if="index <= rating"><StarFilledIcon :class="$style.icon" /></span>
      <span v-else><StarOutlinedIcon :class="$style.icon" /></span>
    </button>
  </div>
</template>

<style module>
.rating {
  display: flex;
  gap: var(--space-xs);
}
.star {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}
.icon {
  transition: transform 0.2s ease;
  cursor: pointer;
}

.icon:hover {
  transform: scale(1.2);
}

.icon:active {
  transform: scale(0.95);
}
</style>
