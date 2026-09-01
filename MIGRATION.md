# Migration from `@arco-design/web-vue`

Uno Arco is a drop-in community fork. Component names, CSS prefix `arco-`, Less tokens, and file layout (`es/` `lib/` `dist/` `json/`) are unchanged.

## Recommended: alias (no code changes)

```json
{
  "dependencies": {
    "@arco-design/web-vue": "npm:@uno-arco/web-vue@^2.59.0"
  }
}
```

`unplugin-vue-components` `ArcoResolver` and `@arco-plugins/vite-vue` keep working because they still resolve `@arco-design/web-vue`.

## Direct install

```bash
pnpm add @uno-arco/web-vue
pnpm remove @arco-design/web-vue
```

Then replace imports:

```diff
- import ArcoVue from '@arco-design/web-vue';
- import '@arco-design/web-vue/dist/arco.css';
+ import ArcoVue from '@uno-arco/web-vue';
+ import '@uno-arco/web-vue/dist/arco.css';
```

## What we will not change in 2.x

- CSS class prefix `arco-`
- Tag names such as `a-button`
- Public component APIs, unless a bug fix requires it (documented in changelog)
