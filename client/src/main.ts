import 'ant-design-vue/dist/reset.css';
import './assets/main.css';
import { Button, Input, Select } from 'ant-design-vue';
import { createPinia } from 'pinia';

import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Select);
app.use(Input);
app.use(Button);

app.mount('#app');
