```yaml
title:
  zh-CN: 最多展示标签数量
  en-US: Max Tags
```

## zh-CN

设置最多展示标签数量。传入对象并设置 `showPopover: true` 时，hover `+N` 可查看被省略的标签（对齐 Arco React）。

---

## en-US

Set the maximum number of display labels. Pass an object with `showPopover: true` to preview omitted tags on hover (aligned with Arco React).

---

```vue
<template>
  <a-space direction="vertical" size="large">
    <a-input-tag
      :default-value="['one', 'two', 'three', 'four']"
      :style="{ width: '380px' }"
      placeholder="Please Enter"
      :max-tag-count="3"
      allow-clear
    />
    <a-input-tag
      :default-value="['one', 'two', 'three', 'four']"
      :style="{ width: '380px' }"
      placeholder="Please Enter"
      :max-tag-count="{ count: 3, showPopover: true }"
      allow-clear
    />
  </a-space>
</template>
```
