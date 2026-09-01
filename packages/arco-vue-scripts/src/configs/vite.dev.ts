import { defineConfig, InlineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import external from '../plugins/vite-plugin-external';

export default defineConfig({
  mode: 'development',
  build: {
    target: 'es2015',
    outDir: 'es',
    emptyOutDir: true,
    minify: false,
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        preserveModules: true,
        preserveModulesRoot: 'components',
      },
    },
    lib: {
      entry: 'components/index.ts',
      formats: ['es'],
    },
    watch: {},
  },

  plugins: [external(), vue(), vueJsx()],
}) as InlineConfig;
