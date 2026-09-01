import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import TimePicker from '../index';

describe('TimePicker', () => {
  test('should emit clear event', async () => {
    const wrapper = mount(TimePicker, {
      props: {
        defaultValue: '10:00:00',
        allowClear: true,
      },
    });

    await nextTick();
    const clearIcon = wrapper.find('.arco-picker-clear-icon');
    expect(clearIcon.exists()).toBe(true);
    await clearIcon.trigger('click');
    await nextTick();

    expect(wrapper.emitted('clear')).toBeTruthy();
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toBeUndefined();
  });
});
