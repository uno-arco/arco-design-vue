import { InlineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import terser from '@rollup/plugin-terser';

export default (type: 'component' | 'icon'): InlineConfig => {
  const entry =
    type === 'component'
      ? 'components/arco-vue.ts'
      : 'components/icon/arco-vue-icon.ts';
  const entryFileName = type === 'component' ? 'arco-vue' : 'arco-vue-icon';
  const name = type === 'component' ? 'ArcoVue' : 'ArcoVueIcon';

  return {
    mode: 'production',
    build: {
      target: 'es2015',
      outDir: 'dist',
      emptyOutDir: false,
      sourcemap: true,
      minify: false,
      rollupOptions: {
        external: 'vue',
        output: [
          {
            format: 'umd',
            name,
            entryFileNames: `${entryFileName}.js`,
            globals: {
              vue: 'Vue',
            },
          },
          {
            format: 'umd',
            name,
            entryFileNames: `${entryFileName}.min.js`,
            globals: {
              vue: 'Vue',
            },
            plugins: [terser()],
          },
        ],
      },
      // 开启lib模式
      lib: {
        entry,
        formats: ['umd'],
        name,
      },
    },
    // @ts-ignore vite内部类型错误
    plugins: [vue(), vueJsx()],
  };
};
