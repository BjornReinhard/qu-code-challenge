<script setup lang="ts">
defineOptions({
  name: 'QuLayout',
});
</script>

<template>
  <section :class="$style.layout">
    <header :class="$style.header">
      <slot name="header" />
    </header>

    <main :class="$style.main" role="main">
      <slot name="main" />
    </main>

    <footer :class="$style.footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style module>
.layout {
  display: grid;
  grid-template-rows: auto 1fr 3.75rem;
  height: 100vh;
  overflow: hidden;
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
