import type { App } from 'vue';
import type { ArcoOptions, SFCWithInstall } from '../_utils/types';
import { setGlobalConfig, getComponentPrefix } from '../_utils/global-config';
import _TimePicker from './time-picker.vue';

const TimePicker: SFCWithInstall<typeof _TimePicker> = Object.assign(_TimePicker, {
  install: (app: App, options?: ArcoOptions) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);

    app.component(componentPrefix + _TimePicker.name, _TimePicker);
  },
});

export type TimePickerInstance = InstanceType<typeof _TimePicker>;

export default TimePicker;
