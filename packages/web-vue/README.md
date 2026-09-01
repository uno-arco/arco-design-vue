# @uno-arco/web-vue

Community-maintained fork of Arco Design Vue. See the [repository README](https://github.com/uno-arco/arco-design-vue#readme) and [MIGRATION.md](https://github.com/uno-arco/arco-design-vue/blob/main/MIGRATION.md).

```bash
npm install @uno-arco/web-vue
```

```typescript
import { createApp } from 'vue'
import ArcoVue from '@uno-arco/web-vue';
import App from './App.vue';
import '@uno-arco/web-vue/dist/arco.css';

const app = createApp(App);
app.use(ArcoVue);
app.mount('#app');
```
