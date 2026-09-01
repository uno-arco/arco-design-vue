declare module '@vitejs/plugin-vue' {
  import type { Plugin } from 'vite';
  const plugin: () => Plugin;
  export default plugin;
}

declare module '@vitejs/plugin-vue-jsx' {
  import type { Plugin } from 'vite';
  const plugin: (options?: Record<string, unknown>) => Plugin;
  export default plugin;
}

declare module 'vite-svg-loader' {
  import type { Plugin } from 'vite';
  const plugin: (options?: Record<string, unknown>) => Plugin;
  export default plugin;
}

declare module '@rollup/plugin-terser' {
  const plugin: (options?: Record<string, unknown>) => any;
  export default plugin;
}
