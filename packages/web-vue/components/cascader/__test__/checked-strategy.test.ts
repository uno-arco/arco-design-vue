import { mount } from '@vue/test-utils';
import Cascader from '../cascader.vue';

const nestedOptions = [
  {
    value: 'beijing',
    label: 'Beijing',
    children: [
      { value: 'chaoyang', label: 'ChaoYang' },
      { value: 'haidian', label: 'Haidian' },
    ],
  },
];

describe('Cascader checkedStrategy (#3395 / #3561)', () => {
  test('checkedStrategy is a declared component prop', () => {
    expect(
      Object.prototype.hasOwnProperty.call(
        Cascader.props ?? {},
        'checkedStrategy'
      )
    ).toBe(true);
  });

  test('default checkedStrategy child emits leaf values when selecting parent', async () => {
    const wrapper = mount(Cascader, {
      props: {
        options: nestedOptions,
        multiple: true,
      },
    });

    await wrapper.find('input').trigger('click');
    const panel = wrapper.findComponent({ name: 'BaseCascaderPanel' });
    const checkboxes = panel.findAllComponents({ name: 'Checkbox' });
    await checkboxes[0].trigger('click');

    expect(wrapper.emitted('change')?.[0]).toEqual([['chaoyang', 'haidian']]);
  });

  test('checkedStrategy parent collapses fully-selected children to parent value', async () => {
    const wrapper = mount(Cascader, {
      props: {
        options: nestedOptions,
        multiple: true,
        checkedStrategy: 'parent',
      },
    });

    await wrapper.find('input').trigger('click');
    const panel = wrapper.findComponent({ name: 'BaseCascaderPanel' });
    const checkboxes = panel.findAllComponents({ name: 'Checkbox' });
    await checkboxes[0].trigger('click');

    expect(wrapper.emitted('change')?.[0]).toEqual([['beijing']]);
  });
});
