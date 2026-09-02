import type { TriggerProps } from '../interface';

/**
 * Repro upstream arco-design/arco-design-vue#3607:
 * scrollToClose should be present in TriggerProps for IDE / TS consumers.
 */
describe('TriggerProps types (#3607)', () => {
  test('TriggerProps accepts scrollToClose and scrollToCloseDistance', () => {
    const props: TriggerProps = {
      scrollToClose: true,
      scrollToCloseDistance: 8,
    };

    expect(props.scrollToClose).toBe(true);
    expect(props.scrollToCloseDistance).toBe(8);
  });

  test('Select triggerProps shape accepts scrollToClose', () => {
    const triggerProps: TriggerProps = {
      updateAtScroll: true,
      scrollToClose: true,
    };

    expect(triggerProps.scrollToClose).toBe(true);
  });
});
