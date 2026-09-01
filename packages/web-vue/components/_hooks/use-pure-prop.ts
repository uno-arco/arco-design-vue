import { ref, toRef, watch, type Ref } from 'vue';
import { isEqual } from '../_utils/is-equal';

export const usePureProp = <
  T extends Record<string, unknown>,
  K extends keyof T
>(
  props: T,
  name: K
): Ref<T[K]> => {
  const _value = toRef(props, name);
  const value = ref<T[K]>(_value.value);
  watch(_value, (cur, pre) => {
    if (!isEqual(cur, pre)) {
      value.value = cur;
    }
  });
  return value;
};
