```yaml
title:
  zh-CN: 多选模式
  en-US: Multiple
```

## zh-CN

通过设置 `multiple` 开启多选模式。设置 `checkedStrategy` 可定制回填方式（仅在多选且非严格模式下生效）。`max-tag-count` 传入 `{ count, showPopover: true }` 可 hover 查看被省略标签。

---

## en-US

Enable multiple selection mode by setting `multiple`. Set `checkedStrategy` for fill-back strategy (multiple + non-strict only). Pass `max-tag-count` as `{ count, showPopover: true }` to preview omitted tags on hover.

---

```vue
<template>
  <a-space direction="vertical">
    <a-cascader
      :options="options"
      :default-value="['chaoyang']"
      :style="{ width: '320px' }"
      placeholder="Please select ..."
      multiple
      checked-strategy="parent"
    />
    <a-cascader
      :options="options"
      :default-value="['datunli', 'jinrongjie', 'tianqiao']"
      :style="{ width: '320px' }"
      placeholder="Please select ..."
      multiple
      :max-tag-count="{ count: 1, showPopover: true }"
    />
  </a-space>
</template>

<script>
export default {
  setup() {
    const options = [
      {
        value: 'beijing',
        label: 'Beijing',
        children: [
          {
            value: 'chaoyang',
            label: 'ChaoYang',
            children: [
              {
                value: 'datunli',
                label: 'Datunli',
              },
            ],
          },
          {
            value: 'haidian',
            label: 'Haidian',
          },
          {
            value: 'dongcheng',
            label: 'Dongcheng',
          },
          {
            value: 'xicheng',
            label: 'Xicheng',
            children: [
              {
                value: 'jinrongjie',
                label: 'Jinrongjie',
              },
              {
                value: 'tianqiao',
                label: 'Tianqiao',
              },
            ],
          },
        ],
      },
      {
        value: 'shanghai',
        label: 'Shanghai',
        children: [
          {
            value: 'huangpu',
            label: 'Huangpu',
          },
        ],
      },
    ];
    return {
      options,
    };
  },
};
</script>
```
