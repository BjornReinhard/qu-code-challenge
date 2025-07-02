<script setup lang="ts">
defineOptions({
  name: 'QuGridItem',
});
</script>

<template>
  <li :class="$style.item">
    <slot></slot>
  </li>
</template>

<style module>
.item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  background-color: var(--bg-surface);
  box-shadow: var(--shadow-default);
}
</style>
