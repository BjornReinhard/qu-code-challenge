import 'ant-design-vue/dist/reset.css';
import { Button, Input, Select, Tooltip } from 'ant-design-vue';
import './assets/main.css';
import 'vue3-toastify/dist/index.css';
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
app.use(Tooltip);

app.mount('#app');
