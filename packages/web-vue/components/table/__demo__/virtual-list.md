```yaml
title:
  zh-CN: 虚拟列表
  en-US: Virtual List
```

## zh-CN

设置 `virtual-list-props` 开启虚拟列表功能。
目前虚拟滚动表格仍有限制：展开行、树形数据支持不完整；固定列可用但不保证复杂场景完全兼容。
**`span-method` / `span-all`（单元格合并）与虚拟列表互斥，请勿同时开启**——合并依赖窗口外的行节点，虚拟化后会导致错乱；后续若支持会单独说明。

---

## en-US

Set `virtual-list-props` to enable the virtual list function.
Virtual scrolling tables still have limitations: expanded rows and tree data are incomplete; fixed columns work but may not be fully reliable in complex scenarios.
**Do not use `span-method` / `span-all` together with virtual list**—merged cells need rows outside the viewport, which virtualization omits and causes layout bugs. Dedicated support may come later.

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
