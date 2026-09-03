import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import InputTag from '../index';

describe('InputTag', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should emit change event', () => {
    const wrapper = mount(InputTag);
    const input = wrapper.find('input');

    input.setValue('test');
    input.trigger('keydown', { key: 'Enter' });
    const emits = wrapper.emitted('change');
    expect(emits).toHaveLength(1);

    // @ts-ignore
    expect(emits?.[0][0][0]).toEqual('test');
  });

  test('should clear content', async () => {
    const wrapper = mount(InputTag, {
      props: {
        defaultValue: ['test', 'test-2', 'test-3'],
        allowClear: true,
      },
    });
    const tags = wrapper.findAllComponents({ name: 'Tag' });
    expect(tags).toHaveLength(3);
    await tags[1].find('.arco-tag-close-btn').trigger('click');
    expect(wrapper.emitted('remove')).toHaveLength(1);
    await wrapper.find('.arco-input-tag-clear-btn').trigger('click');
    expect(wrapper.emitted('clear')).toHaveLength(1);
  });

  test('maxTagCount number collapses overflow into +N tag', () => {
    const wrapper = mount(InputTag, {
      props: {
        defaultValue: ['one', 'two', 'three', 'four'],
        maxTagCount: 2,
      },
    });
    const tags = wrapper.findAllComponents({ name: 'Tag' });
    expect(tags).toHaveLength(3);
    expect(tags[2].text()).toContain('+2');
    expect(wrapper.findComponent({ name: 'Popover' }).exists()).toBe(false);
  });

  test('maxTagCount.showPopover wraps overflow tag with Popover', async () => {
    const wrapper = mount(InputTag, {
      props: {
        defaultValue: ['one', 'two', 'three', 'four'],
        maxTagCount: {
          count: 2,
          showPopover: { defaultPopupVisible: true },
        },
      },
      attachTo: document.body,
    });

    expect(wrapper.findComponent({ name: 'Popover' }).exists()).toBe(true);
    expect(wrapper.text()).toContain('+2');
    await nextTick();

    const popoverTags = document.body.querySelectorAll(
      '.arco-input-tag-invisible-popover-content .arco-tag'
    );
    expect(popoverTags.length).toBe(2);
    expect(popoverTags[0].textContent).toContain('three');
    expect(popoverTags[1].textContent).toContain('four');
  });

  test('removing a tag inside showPopover uses the real value index', async () => {
    const wrapper = mount(InputTag, {
      props: {
        'modelValue': ['one', 'two', 'three', 'four'],
        'onUpdate:modelValue': (value: string[]) =>
          wrapper.setProps({ modelValue: value }),
        'maxTagCount': {
          count: 2,
          showPopover: { defaultPopupVisible: true },
        },
      },
      attachTo: document.body,
    });

    await nextTick();

    const closeBtns = document.body.querySelectorAll(
      '.arco-input-tag-invisible-popover-content .arco-tag-close-btn'
    );
    expect(closeBtns.length).toBe(2);
    // Remove "three" (first invisible tag → index 2)
    (closeBtns[0] as HTMLElement).click();
    await nextTick();

    expect(wrapper.emitted('remove')?.[0]?.[0]).toBe('three');
    expect(wrapper.props('modelValue')).toEqual(['one', 'two', 'four']);
  });
});
