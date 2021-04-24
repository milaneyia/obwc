import './assets/sass/main.scss';
import 'bootstrap/js/dist/modal';
import { createApp } from 'vue';
import App from './App.vue';
import { tooltip } from './directives';
import router from './router/main';
import { store } from './store/main';
import http from './http';
import md from './markdown';

const app = createApp(App);
app.use(router);
app.use(store);

app.config.globalProperties.$http = http;
app.config.globalProperties.$md = md;

app.directive('bs-tooltip', tooltip);

app.mount('#app');
