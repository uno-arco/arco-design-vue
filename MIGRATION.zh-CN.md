# 从 `@arco-design/web-vue` 迁移

Uno Arco 是社区 fork，作为 drop-in 使用。组件名、CSS 前缀 `arco-`、Less token、产物目录（`es/` `lib/` `dist/` `json/`）都没有改。

## 推荐：alias（不用改业务代码）

```json
{
  "dependencies": {
    "@arco-design/web-vue": "npm:@uno-arco/web-vue@^2.60.0"
  }
}
```

`unplugin-vue-components` 的 `ArcoResolver` 和 `@arco-plugins/vite-vue` 按需加载都可以继续用，因为解析的还是 `@arco-design/web-vue`。

## 直接安装新包名

```bash
pnpm add @uno-arco/web-vue
pnpm remove @arco-design/web-vue
```

然后替换 import：

```diff
- import ArcoVue from '@arco-design/web-vue';
- import '@arco-design/web-vue/dist/arco.css';
+ import ArcoVue from '@uno-arco/web-vue';
+ import '@uno-arco/web-vue/dist/arco.css';
```

## 2.x 不会改的东西

- CSS 类名前缀 `arco-`
- 标签名，例如 `a-button`
- 组件对外 API（除非修 bug 必须动，会写进 changelog）
