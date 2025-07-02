<script setup lang="ts">
defineOptions({
  name: 'QuGridItems',
});
</script>

<template>
  <TransitionGroup name="fade" tag="ul" :class="$style.gridItems" aria-label="Grid list">
    <slot></slot>
  </TransitionGroup>
</template>

<style>
.fade-enter-from {
  opacity: 0;
  transform: translateY(0.625rem);
}

.fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-enter-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
  transition-delay: calc(var(--i, 0) * 80ms);
}
</style>

<style module>
.gridItems {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: var(--space-md);
  padding-bottom: var(--space-xl);
}
</style>
