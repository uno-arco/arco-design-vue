import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Trigger from '../index';
import { isElementOutsideScrollView } from '../utils';

const domRect = (rect: Partial<DOMRect>): DOMRect =>
  ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
    ...rect,
  } as DOMRect);

describe('Trigger', () => {
  test('trigger correctly', async () => {
    const wrapper = mount(Trigger, {
      slots: {
        default: '<button>Test</button>',
        content: '<div id="popup-content">Popup Content</div>',
      },
      props: {
        trigger: 'click',
      },
    });

    await wrapper.find('button').trigger('click');

    expect(document.body.innerHTML).toContain(
      '<div id="popup-content">Popup Content</div>'
    );
  });

  test('default visible correctly', async () => {
    const wrapper = mount(Trigger, {
      slots: {
        default: '<button>Test</button>',
        content: '<div id="popup-content">Popup Content</div>',
      },
      props: {
        defaultPopupVisible: true,
      },
    });

    expect(document.body.innerHTML).toContain(
      '<div id="popup-content">Popup Content</div>'
    );
  });

  test('keeps the last popup position when the trigger element is hidden', async () => {
    const wrapper = mount(Trigger, {
      slots: {
        default: '<button>Test</button>',
        content: '<div id="hidden-trigger-popup-content">Popup Content</div>',
      },
      props: {
        trigger: 'click',
      },
    });

    const button = wrapper.find('button').element as HTMLElement;
    const rectSpy = vi.spyOn(button, 'getBoundingClientRect').mockReturnValue(
      domRect({
        top: 100,
        bottom: 120,
        left: 200,
        right: 240,
        width: 40,
        height: 20,
        x: 200,
        y: 100,
      })
    );

    await wrapper.find('button').trigger('click');
    await nextTick();

    const popup = document
      .getElementById('hidden-trigger-popup-content')
      ?.closest('.arco-trigger-popup') as HTMLElement;
    const styleBefore = popup.getAttribute('style');

    rectSpy.mockReturnValue(domRect({}));
    await wrapper.setProps({ autoFitPopupMinWidth: true });
    await nextTick();

    expect(popup.getAttribute('style')).toBe(styleBefore);
  });

  test('detects trigger outside scroll container', () => {
    const scrollParent = document.createElement('div');
    Object.defineProperty(scrollParent, 'scrollHeight', { value: 400 });
    Object.defineProperty(scrollParent, 'offsetHeight', { value: 100 });
    Object.defineProperty(scrollParent, 'scrollWidth', { value: 100 });
    Object.defineProperty(scrollParent, 'offsetWidth', { value: 100 });
    vi.spyOn(scrollParent, 'getBoundingClientRect').mockReturnValue(
      domRect({
        top: 0,
        bottom: 100,
        left: 0,
        right: 100,
        width: 100,
        height: 100,
      })
    );

    const trigger = document.createElement('button');
    scrollParent.appendChild(trigger);
    document.body.appendChild(scrollParent);

    vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue(
      domRect({
        top: 150,
        bottom: 170,
        left: 10,
        right: 50,
        width: 40,
        height: 20,
      })
    );

    expect(isElementOutsideScrollView(trigger)).toBe(true);

    vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue(
      domRect({
        top: 40,
        bottom: 60,
        left: 10,
        right: 50,
        width: 40,
        height: 20,
      })
    );
    expect(isElementOutsideScrollView(trigger)).toBe(false);

    scrollParent.remove();
  });

  test('closes popup when updateAtScroll trigger leaves scroll view', async () => {
    const scrollParent = document.createElement('div');
    Object.defineProperty(scrollParent, 'scrollHeight', { value: 400 });
    Object.defineProperty(scrollParent, 'offsetHeight', { value: 100 });
    Object.defineProperty(scrollParent, 'scrollWidth', { value: 100 });
    Object.defineProperty(scrollParent, 'offsetWidth', { value: 100 });
    document.body.appendChild(scrollParent);

    const wrapper = mount(Trigger, {
      attachTo: scrollParent,
      slots: {
        default: '<button id="scroll-trigger-btn">Test</button>',
        content: '<div id="scroll-trigger-popup">Popup Content</div>',
      },
      props: {
        trigger: 'click',
        updateAtScroll: true,
      },
    });

    const button = wrapper.find('button').element as HTMLElement;
    vi.spyOn(button, 'getBoundingClientRect').mockReturnValue(
      domRect({
        top: 40,
        bottom: 60,
        left: 10,
        right: 50,
        width: 40,
        height: 20,
      })
    );
    vi.spyOn(scrollParent, 'getBoundingClientRect').mockReturnValue(
      domRect({
        top: 0,
        bottom: 100,
        left: 0,
        right: 100,
        width: 100,
        height: 100,
      })
    );

    await wrapper.find('button').trigger('click');
    await nextTick();
    expect(document.getElementById('scroll-trigger-popup')).toBeTruthy();
    expect(wrapper.emitted('popupVisibleChange')?.at(-1)).toEqual([true]);

    vi.spyOn(button, 'getBoundingClientRect').mockReturnValue(
      domRect({
        top: 150,
        bottom: 170,
        left: 10,
        right: 50,
        width: 40,
        height: 20,
      })
    );

    scrollParent.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await nextTick();

    expect(wrapper.emitted('popupVisibleChange')?.at(-1)).toEqual([false]);

    wrapper.unmount();
    scrollParent.remove();
  });
});
