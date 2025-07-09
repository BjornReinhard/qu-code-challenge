<script setup lang="ts">
import LoadingIcon from '@/components/icons/LoadingIcon.vue';

defineOptions({
  name: 'QuButton',
  inheritAttrs: false,
});

defineProps<{
  type: 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'default';
  loading?: boolean;
  tooltip?: string;
}>();
</script>

<template>
  <ATooltip :title="tooltip">
    <AButton v-bind="$attrs" :type="type" :class="$style.button">
      <LoadingIcon :class="$style.loadingIcon" v-if="loading" />
      <slot v-else name="icon" />
      <slot name="default" />
    </AButton>
  </ATooltip>
</template>

<style module>
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-sm);
}

.loadingIcon {
  width: 18px;
  height: 18px;
}
</style>
