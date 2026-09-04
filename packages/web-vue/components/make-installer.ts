import type { App, Plugin } from 'vue';
import type { ArcoOptions } from './_utils/types';

/**
 * Element Plus–style installer factory.
 * Returns a Vue Plugin object `{ install }` so `app.use(...)` type-checks on Vue 3.5+.
 */
export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App, options?: ArcoOptions) => {
    for (const component of components) {
      app.use(component, options);
    }
  };

  return {
    install,
  };
};

export default makeInstaller;
