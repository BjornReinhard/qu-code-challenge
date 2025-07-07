<script setup lang="ts">
defineOptions({
  name: 'QuButton',
});

defineProps<{
  type: 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'default';
}>();
</script>

<template>
  <AButton :type="type" :class="$style.button">
    <slot name="icon" />
    <slot name="default" />
  </AButton>
</template>

<style module>
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-sm);
}
</style>
