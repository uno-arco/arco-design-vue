import { Ref, ref } from 'vue';
import { getScrollBarWidth, isScroll } from '../_utils/dom';

export const useOverflow = (elementRef: Ref<HTMLElement | undefined>) => {
  const isSetOverflow = ref(false);

  const originStyle = {
    overflow: '',
    paddingRight: '',
  };

  const setOverflowHidden = () => {
    if (elementRef.value) {
      const element = elementRef.value;
      if (!isSetOverflow.value && element.style.overflow !== 'hidden') {
        const scrollBarWidth = getScrollBarWidth(element);
        if (scrollBarWidth > 0 || isScroll(element)) {
          originStyle.overflow = element.style.overflow;
          originStyle.paddingRight = element.style.paddingRight;

          // Prefer padding-right over width so iframe / nested layouts don't
          // reflow when the body scrollbar is locked (Drawer / Modal).
          const computedPaddingRight = Number.parseFloat(
            window.getComputedStyle(element).paddingRight || '0'
          );
          element.style.overflow = 'hidden';
          element.style.paddingRight = `${
            computedPaddingRight + scrollBarWidth
          }px`;

          isSetOverflow.value = true;
        }
      }
    }
  };

  const resetOverflow = () => {
    if (elementRef.value && isSetOverflow.value) {
      const element = elementRef.value;
      element.style.overflow = originStyle.overflow;
      element.style.paddingRight = originStyle.paddingRight;

      isSetOverflow.value = false;
    }
  };

  return {
    setOverflowHidden,
    resetOverflow,
  };
};
