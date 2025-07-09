<script setup lang="ts">
import QuScrollToTop from '@/components/ScrollToTop.vue';

defineOptions({
  name: 'QuLayout',
});
</script>

<template>
  <section :class="$style.layout">
    <header :class="$style.header">
      <slot name="header" />
    </header>

    <main :class="$style.main" role="main" id="main">
      <slot name="main" />
    </main>

    <footer :class="$style.footer">
      <slot name="footer" />
    </footer>
    <QuScrollToTop targetSelector="#main" />
  </section>
</template>

<style module>
.layout {
  display: grid;
  grid-template-rows: auto 1fr 3.75rem;
  height: 100vh;
}

.header,
.footer {
  display: flex;
  justify-content: center;
  background-color: var(--bg-header-footer);
  width: 100%;
}

.header {
  border-bottom: 0.0625rem solid var(--border-default);
}

.footer {
  height: 3.75rem;
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.main {
  display: flex;
  justify-content: center;
  overflow-y: auto;
  padding: var(--space-xl) var(--space-lg);
  background-color: var(--bg-surface);
  scrollbar-gutter: stable;
}
</style>
