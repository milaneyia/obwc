import './assets/sass/main.scss';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/collapse';
import { createApp } from 'vue';
import App from './App.vue';
import { tooltip } from './directives';
import router from './router/main';
import { store } from './store/main';
import http from './http';
import md from './markdown';
import { formatDate } from './formatDate';

const app = createApp(App);
app.use(router);
app.use(store);

app.config.globalProperties.$http = http;
app.config.globalProperties.$md = md;
app.config.globalProperties.$formatDate = formatDate;

app.directive('bs-tooltip', tooltip);

app.mount('#app');
