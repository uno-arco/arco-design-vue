```yaml
title:
  zh-CN: 虚拟列表
  en-US: Virtual List
```

## zh-CN

设置 `virtual-list-props` 开启虚拟列表功能。
目前虚拟滚动表格仍有限制：展开行、树形数据支持不完整；固定列可用但不保证与复杂合并单元格等场景完全兼容。

---

## en-US

Set `virtual-list-props` to enable the virtual list function.
Virtual scrolling tables still have limitations: expanded rows and tree data are incomplete; fixed columns work but may not be fully reliable with complex cell spans.

---

```vue
<template>
  <a-table
    :columns="columns"
    :data="data"
    :row-selection="rowSelection"
    :virtual-list-props="{ height: 400 }"
    :pagination="false"
    :scroll="{ x: 1000 }"
  />
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    fixed: 'left',
    width: 140
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
];

const data = reactive(Array(1000).fill(null).map((_, index) => ({
  key: String(index),
  name: `User ${index + 1}`,
  address: '32 Park Road, London',
  email: `user.${index + 1}@example.com`
})));

const rowSelection = {
  type: 'checkbox',
  showCheckedAll: true
};
</script>
```
