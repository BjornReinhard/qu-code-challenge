<script setup lang="ts">
defineOptions({
  name: 'QuAppLayout',
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
  grid-template-rows: 3.75rem 1fr 3.75rem;
  height: 100vh;
  overflow: hidden;
}

.header,
.footer {
  height: 3.75rem;
  display: flex;
  justify-content: center;
  background-color: var(--bg-header-footer);
}

.header {
  border-bottom: 0.0625rem solid var(--border-default);
}

.footer {
}

.main {
  display: flex;
  justify-content: center;
  overflow-y: auto;
  padding: var(--space-xl) var(--space-lg);
  background-color: var(--bg-surface);
}

@media (max-width: 88.125rem) {
  .header,
  .footer {
    height: auto;
  }
  .layout {
    grid-template-rows: 7rem 1fr 3rem;
  }
}

@media (max-width: 44.625rem) {
  .header,
  .footer {
    height: auto;
  }
  .layout {
    grid-template-rows: 15rem 1fr 3rem;
  }
}
</style>
