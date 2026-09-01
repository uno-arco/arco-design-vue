import { InlineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';
import terser from '@rollup/plugin-terser';

export default ({ name }: { name: string }): InlineConfig => {
  return {
    mode: 'production',
    build: {
      target: 'es2015',
      outDir: 'dist',
      emptyOutDir: false,
      sourcemap: true,
      minify: false,
      rollupOptions: {
        external: [
          'vue',
          '@arco-design/web-vue',
          '@arco-design/web-vue/es/icon',
          '@uno-arco/web-vue',
          '@uno-arco/web-vue/es/icon',
        ],
        output: [
          {
            format: 'umd',
            name,
            entryFileNames: `index.js`,
            sourcemap: true,
            globals: {
              'vue': 'Vue',
              '@arco-design/web-vue': 'ArcoVue',
              '@arco-design/web-vue/es/icon': 'ArcoVueIcon',
              '@uno-arco/web-vue': 'ArcoVue',
              '@uno-arco/web-vue/es/icon': 'ArcoVueIcon',
            },
          },
          {
            format: 'umd',
            name,
            entryFileNames: `index.min.js`,
            sourcemap: true,
            globals: {
              'vue': 'Vue',
              '@arco-design/web-vue': 'ArcoVue',
              '@arco-design/web-vue/es/icon': 'ArcoVueIcon',
              '@uno-arco/web-vue': 'ArcoVue',
              '@uno-arco/web-vue/es/icon': 'ArcoVueIcon',
            },
            plugins: [terser()],
          },
        ],
      },
      // 开启lib模式
      lib: {
        entry: 'components/components.ts',
        formats: ['umd'],
        name,
      },
    },
    // @ts-ignore vite内部类型错误
    plugins: [vue(), vueJsx(), svgLoader()],
  };
};
