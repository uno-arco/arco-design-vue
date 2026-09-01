# @uno-arco/web-vue

Arco Design Vue 的社区维护版本。详见 [仓库 README](https://github.com/uno-arco/arco-design-vue/blob/main/README.zh-CN.md) 和 [迁移说明](https://github.com/uno-arco/arco-design-vue/blob/main/MIGRATION.zh-CN.md)。

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
