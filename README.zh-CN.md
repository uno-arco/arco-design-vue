<div align="center">
  <h1>Uno Arco</h1>
  <p><a href="https://github.com/arco-design/arco-design-vue">Arco Design Vue</a> 的社区维护版本。</p>
  <p>
    <a href="https://github.com/uno-arco/arco-design-vue/blob/main/LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-blue.svg" /></a>
    <a href="https://www.npmjs.com/package/@uno-arco/web-vue"><img alt="npm" src="https://img.shields.io/npm/v/@uno-arco/web-vue.svg" /></a>
  </p>
  <p><a href="./README.md">English</a> | 简体中文</p>
</div>

**不是**字节跳动 / Arco Design 官方项目。在 MIT 协议下继续维护 [arco-design/arco-design-vue](https://github.com/arco-design/arco-design-vue)：组件名（`a-button`）、CSS 前缀（`arco-`）、主题 token 都保持兼容。

# 安装

```bash
npm install @uno-arco/web-vue
# 或
pnpm add @uno-arco/web-vue
```

存量项目可以不改 import，用 npm alias 做掉包：

```json
{
  "dependencies": {
    "@arco-design/web-vue": "npm:@uno-arco/web-vue@^2.58.1"
  }
}
```

详见 [MIGRATION.zh-CN.md](./MIGRATION.zh-CN.md)。

# 例子

```typescript
import { createApp } from 'vue'
import ArcoVue from '@uno-arco/web-vue';
import App from './App.vue';
import '@uno-arco/web-vue/dist/arco.css';

const app = createApp(App);
app.use(ArcoVue);
app.mount('#app');
```

# 特性

- 60+ 个 Vue 3 组件
- 通过 Less 定制主题（CSS 类名未改，官方 Design Lab 主题仍可用）
- TypeScript

# 相关链接

- [文档站（GitHub Pages）](https://uno-arco.github.io/arco-design-vue/)
- [上游仓库](https://github.com/arco-design/arco-design-vue)
- [官方文档](https://arco.design/vue)（字节跳动）
- [Figma](https://www.figma.com/file/FVu1DydEeXvJqXrkOb90Oi/ArcoDesign%E7%BB%84%E4%BB%B6%E8%AE%BE%E8%AE%A1_2.0?node-id=5472%3A308)

# 参与贡献

请先阅读 [行为准则](./CODE_OF_CONDUCT.md) 和 [贡献指南](./CONTRIBUTING.zh-CN.md)。

# License

[MIT 协议](./LICENSE)。原作 © ByteDance；社区改动 © Uno Arco contributors。
