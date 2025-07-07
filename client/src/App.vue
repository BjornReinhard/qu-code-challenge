<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <ConfigProvider
    :theme="{
      components: {
        Button: {
          colorPrimary: '#090909',
        },
      },
    }"
  >
    <RouterView />
  </ConfigProvider>
</template>
