export const mainContent = `import { createApp } from 'vue';
import ArcoVue from '@uno-arco/web-vue';
import App from './App.vue';
import '@uno-arco/web-vue/dist/arco.css';
import './style.css';

const app = createApp(App);
app.use(ArcoVue);
app.mount('#app');`;

export const styleContent = `#app { padding: 20px; }`;
