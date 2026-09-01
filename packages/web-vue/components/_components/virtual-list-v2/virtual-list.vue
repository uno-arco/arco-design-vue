<template>
  <Component
    :is="mergedComponent.container"
    ref="containerRef"
    :class="prefixCls"
    :style="style"
    v-bind="scrollbarBind"
    @scroll="onScroll"
  >
    <Component
      :is="mergedComponent.list"
      v-bind="listAttrs"
      :style="
        paddingPosition === 'list'
          ? {
              paddingTop: `${frontPadding}px`,
              paddingBottom: `${behindPadding}px`,
            }
          : {}
      "
    >
      <Component
        :is="mergedComponent.content"
        ref="contentRef"
        v-bind="contentAttrs"
        :style="
          paddingPosition === 'content'
            ? {
                paddingTop: `${frontPadding}px`,
                paddingBottom: `${behindPadding}px`,
              }
            : {}
        "
      >
        <VirtualListItem
          v-for="(item, index) of currentList"
          :key="item[itemKey] ?? start + index"
          :has-item-size="hasItemSize"
          :set-item-size="setItemSize"
        >
          <slot name="item" :item="item" :index="start + index" />
        </VirtualListItem>
      </Component>
    </Component>
  </Component>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  ref,
  toRefs,
  PropType,
} from 'vue';
import { useSize } from './hooks/use-size';
import VirtualListItem from './virtual-list-item';
import { getPrefixCls } from '../../_utils/global-config';
import { ScrollOptions } from './interface';
import { isComponentInstance, isNumber, isObject } from '../../_utils/is';
import Scrollbar, { ScrollbarProps } from '../../scrollbar';
import { useScrollbar } from '../../_hooks/use-scrollbar';

export default defineComponent({
  name: 'VirtualList',
  components: { VirtualListItem },
  props: {
    height: {
      type: [Number, String],
      default: 200,
    },
    data: {
      type: Array as PropType<Record<string, any>[]>,
      default: () => [],
    },
    threshold: {
      type: Number,
      default: 0,
    },
    itemKey: {
      type: String,
      default: 'key',
    },
    fixedSize: {
      type: Boolean,
      default: false,
    },
    estimatedSize: {
      type: Number,
      default: 30,
    },
    buffer: {
      type: Number,
      default: 10,
    },
    component: {
      type: [String, Object],
      default: 'div',
    },
    listAttrs: {
      type: Object,
    },
    contentAttrs: {
      type: Object,
    },
    paddingPosition: {
      type: String,
      default: 'content',
    },
    /**
     * @zh 是否开启虚拟滚动条 / 传入滚动条配置
     * @en Whether to enable the virtual scrollbar, or pass scrollbar props
     */
    scrollbar: {
      type: [Boolean, Object] as PropType<boolean | ScrollbarProps>,
      default: false,
    },
  },
  emits: {
    scroll: (ev: Event) => true,
    reachBottom: (ev: Event) => true,
  },
  setup(props, { emit }) {
    const {
      data,
      itemKey,
      fixedSize,
      estimatedSize,
      buffer,
      height,
      scrollbar,
    } = toRefs(props);
    const prefixCls = getPrefixCls('virtual-list');
    const { displayScrollbar, scrollbarProps } = useScrollbar(scrollbar);

    const mergedComponent = computed(() => {
      const base = isObject(props.component)
        ? {
            container: 'div',
            list: 'div',
            content: 'div',
            ...props.component,
          }
        : {
            container: props.component,
            list: 'div',
            content: 'div',
          };
      if (displayScrollbar.value) {
        return {
          ...base,
          container: Scrollbar,
        };
      }
      return base;
    });

    const scrollbarBind = computed(() =>
      displayScrollbar.value ? scrollbarProps.value : undefined
    );

    const containerRef = ref();
    const contentRef = ref<HTMLElement>();

    const style = computed(() => {
      return {
        height: isNumber(height.value) ? `${height.value}px` : height.value,
        overflow: 'auto',
      };
    });

    const dataKeys = computed(() =>
      data.value.map((item: any, index) => {
        return (item[itemKey.value] ?? index) as string | number;
      })
    );

    const {
      frontPadding,
      behindPadding,
      start,
      end,
      getStartByScroll,
      setItemSize,
      hasItemSize,
      setStart,
      getScrollOffset,
    } = useSize({
      dataKeys,
      contentRef,
      fixedSize,
      estimatedSize,
      buffer,
    });

    const currentList = computed(() => {
      if (props.threshold && data.value.length <= props.threshold) {
        return data.value;
      }

      return data.value.slice(start.value, end.value);
    });

    const getScrollElement = (): HTMLElement | undefined => {
      const el = containerRef.value;
      if (!el) {
        return undefined;
      }
      if (el instanceof HTMLElement) {
        return el;
      }
      if (isComponentInstance(el)) {
        const inner = el.$refs?.containerRef;
        if (inner instanceof HTMLElement) {
          return inner;
        }
      }
      return undefined;
    };

    const onScroll = (ev: Event) => {
      const { scrollTop, scrollHeight, offsetHeight } =
        ev.target as HTMLElement;
      const _start = getStartByScroll(scrollTop);
      if (_start !== start.value) {
        setStart(_start);
        nextTick(() => {
          scrollTo(scrollTop);
        });
      }
      emit('scroll', ev);
      const bottom = Math.floor(scrollHeight - (scrollTop + offsetHeight));
      if (bottom <= 0) {
        emit('reachBottom', ev);
      }
    };

    const scrollTo = (options: ScrollOptions) => {
      const scrollEl = getScrollElement();
      if (scrollEl) {
        if (isNumber(options)) {
          scrollEl.scrollTop = options;
        } else {
          const _index =
            options.index ?? dataKeys.value.indexOf(options.key ?? '');
          setStart(_index - buffer.value);
          scrollEl.scrollTop = getScrollOffset(_index);
          nextTick(() => {
            const latest = getScrollElement();
            if (latest) {
              const _scrollTop = getScrollOffset(_index);
              if (_scrollTop !== latest.scrollTop) {
                latest.scrollTop = _scrollTop;
              }
            }
          });
        }
      }
    };

    return {
      prefixCls,
      containerRef,
      contentRef,
      frontPadding,
      currentList,
      behindPadding,
      onScroll,
      setItemSize,
      hasItemSize,
      start,
      scrollTo,
      getScrollElement,
      style,
      mergedComponent,
      scrollbarBind,
    };
  },
});
</script>
