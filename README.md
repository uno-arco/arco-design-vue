<div align="center">
  <h1>Uno Arco</h1>
  <p>Community-maintained fork of <a href="https://github.com/arco-design/arco-design-vue">Arco Design Vue</a>.</p>
  <p>
    <a href="https://github.com/uno-arco/arco-design-vue/blob/main/LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-blue.svg" /></a>
    <a href="https://www.npmjs.com/package/@uno-arco/web-vue"><img alt="npm" src="https://img.shields.io/npm/v/@uno-arco/web-vue.svg" /></a>
  </p>
  <p>English | <a href="./README.zh-CN.md">简体中文</a></p>
</div>

This is **not** an official ByteDance / Arco Design project. It continues [arco-design/arco-design-vue](https://github.com/arco-design/arco-design-vue) under MIT: same component names (`a-button`), same CSS prefix (`arco-`), same theme tokens.

# Why Uno Arco (`2.59.0`)

Relative to the last official `2.58.x` line, this fork focuses on unmerged bugfixes and a modern toolchain (Vue 3.5 / Vite 7). Highlights:

- **Table:** virtual-list keys / sticky offsets / scrollbar; `clearSelected()` for cross-page selection
- **Cascader:** large-tree search freeze, lazy `isLeaf`, Enter on non-leaf, panel `v-model`
- **Trigger / Drawer / Typography:** scroll-away popup, iframe-safe body lock, ellipsis tooltip loop
- **Also:** ColorPicker, Select sync, TimePicker `clear`, Affix width, InputNumber `e`, and more

Full list with upstream issue/PR links: [CHANGELOG](./packages/web-vue/CHANGELOG.md). Hard items such as Table `span-method` + virtual list remain unsupported ([#3666](https://github.com/arco-design/arco-design-vue/issues/3666)).

# Installation

```bash
npm install @uno-arco/web-vue
# or
pnpm add @uno-arco/web-vue
```

Drop-in for existing apps (keep old import paths):

```json
{
  "dependencies": {
    "@arco-design/web-vue": "npm:@uno-arco/web-vue@^2.59.0"
  }
}
```

See [MIGRATION.md](./MIGRATION.md) for details.

# Example

```typescript
import { createApp } from 'vue'
import ArcoVue from '@uno-arco/web-vue';
import App from './App.vue';
import '@uno-arco/web-vue/dist/arco.css';

const app = createApp(App);
app.use(ArcoVue);
app.mount('#app');
```

# Features

- 60+ Vue 3 components
- Theme tokens via Less (Design Lab themes still apply because CSS class names are unchanged)
- TypeScript

# Links

- [Docs (GitHub Pages)](https://uno-arco.github.io/arco-design-vue/)
- [Upstream Arco Design Vue](https://github.com/arco-design/arco-design-vue)
- [Official docs](https://arco.design/vue) (ByteDance)
- [Figma](https://www.figma.com/file/FVu1DydEeXvJqXrkOb90Oi/ArcoDesign%E7%BB%84%E4%BB%B6%E8%AE%BE%E8%AE%A1_2.0?node-id=5472%3A308)

# Contributing

Please read the [Code of Conduct](./CODE_OF_CONDUCT.md) and [Contributing Guide](./CONTRIBUTING.md).

# License

[MIT](./LICENSE). Original work © ByteDance; community changes © Uno Arco contributors.
