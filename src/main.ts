import './assets/main.scss';
import { createApp } from 'vue';
import App from './App.vue';
import { tooltip } from './directives';
import router from './router/main';
import { store } from './store/main';
import http from './http';

const app = createApp(App);
app.use(router);
app.use(store);

app.config.globalProperties.$http = http;

app.directive('bs-tooltip', tooltip);

app.mount('#app');
