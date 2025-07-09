<script setup lang="ts">
import ArrowUpIcon from '@/components/icons/ArrowUpIcon.vue';
import { onMounted, onUnmounted, ref } from 'vue';

defineOptions({
  name: 'QuScrollToTop',
});

const props = defineProps<{
  targetSelector: string;
  minHeight?: number;
}>();

const isVisible = ref(false);
let targetEl: HTMLElement | null = null;
const minHeight = ref(props.minHeight || 200);

const onScroll = () => {
  if (!targetEl) return;
  isVisible.value = targetEl.scrollTop > minHeight.value;
};

const scrollToTop = () => {
  if (!targetEl) return;
  targetEl.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  targetEl = document.querySelector(props.targetSelector);
  if (targetEl) {
    targetEl.addEventListener('scroll', onScroll);
  }
});

onUnmounted(() => {
  if (targetEl) {
    targetEl.removeEventListener('scroll', onScroll);
  }
});
</script>

<template>
  <transition name="scroll-fade">
    <div
      v-if="isVisible"
      :class="$style.scrollToTop"
      @click="scrollToTop"
      aria-label="Scroll to top"
    >
      <ArrowUpIcon />
    </div>
  </transition>
</template>

<style scoped>
.scroll-fade-enter-active,
.scroll-fade-leave-active {
  transition: opacity 0.3s ease;
}
.scroll-fade-enter-from,
.scroll-fade-leave-to {
  opacity: 0;
}
</style>
<style module>
.scrollToTop {
  position: fixed;
  bottom: 0.5rem;
  right: 1rem;
  background-color: var(--color-white);
  border: 0.0625rem solid var(--border-strong);
  padding: 0.5rem 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  z-index: 999;
  transition: opacity 0.3s ease;
  box-shadow: var(--shadow-default);
}
</style>
