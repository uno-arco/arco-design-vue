import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDocs from '@arco-design/vite-plugin-arco-vue-docs';

const packageRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      // Demo markdown still imports the upstream package name; map to local source
      // so vitest works without hoisting workspace alias to the repo root (Linux CI).
      '@arco-design/web-vue/es/locale': path.resolve(
        packageRoot,
        'components/locale'
      ),
      '@arco-design/web-vue/es/icon': path.resolve(
        packageRoot,
        'components/icon/index.ts'
      ),
      '@arco-design/web-vue': path.resolve(
        packageRoot,
        'components/index.ts'
      ),
    },
  },
  plugins: [vueDocs(), vue(), vueJsx()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./scripts/setup.ts'],
    testTimeout: 20000,
    hookTimeout: 20000,
    include: ['components/**/__test__/**/*.{test,spec}.{js,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reportsDirectory: '.coverage',
      include: ['components/**/*.{vue,tsx,ts}'],
      exclude: ['components/icon/**/*', '**/style/*'],
    },
  },
});
