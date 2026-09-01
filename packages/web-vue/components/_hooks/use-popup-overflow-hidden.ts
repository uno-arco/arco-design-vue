import { toRefs, watchEffect } from 'vue';

interface PopupOverflowHiddenProps {
  container: HTMLElement | undefined;
  hidden: boolean;
}

export default function usePopupOverflowHidden(
  props: PopupOverflowHiddenProps
) {
  const { container, hidden } = toRefs(props);

  let needResetContainerStyle = false;
  let originContainerStyle: Partial<CSSStyleDeclaration> = {};

  const getScrollBarWidth = (element: HTMLElement) => {
    return element.tagName === 'BODY'
      ? window.innerWidth -
          (document.body.clientWidth || document.documentElement.clientWidth)
      : element.offsetWidth - element.clientWidth;
  };

  const setContainerStyle = () => {
    if (container.value && container.value.style.overflow !== 'hidden') {
      const originStyle = container.value.style;
      needResetContainerStyle = true;

      const containerScrollBarWidth = getScrollBarWidth(container.value);
      if (containerScrollBarWidth) {
        originContainerStyle.paddingRight = originStyle.paddingRight;
        const computedPaddingRight = Number.parseFloat(
          window.getComputedStyle(container.value).paddingRight || '0'
        );
        container.value.style.paddingRight = `${
          computedPaddingRight + containerScrollBarWidth
        }px`;
      }

      originContainerStyle.overflow = originStyle.overflow;
      container.value.style.overflow = 'hidden';
    }
  };

  const resetContainerStyle = () => {
    if (container.value && needResetContainerStyle) {
      const originStyle = originContainerStyle;
      Object.keys(originStyle).forEach((i) => {
        // @ts-ignore-next-line
        container.value.style[i] = originStyle[i];
      });
    }
    needResetContainerStyle = false;
    originContainerStyle = {};
  };

  watchEffect((onInvalidate) => {
    hidden.value ? setContainerStyle() : resetContainerStyle();

    onInvalidate(() => {
      resetContainerStyle();
    });
  });

  return [resetContainerStyle, setContainerStyle];
}
