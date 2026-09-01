import { InlineConfig } from 'vite';

const config: InlineConfig = {
  mode: 'production',
  build: {
    target: 'es2015',
    outDir: 'dist/css',
    emptyOutDir: false,
    minify: false,
    rollupOptions: {
      external: /less$/,
      output: [
        {
          format: 'es',
          dir: 'dist/css',
          entryFileNames: '[name].js',
        },
      ],
    },
    lib: {
      entry: 'src/style/index.ts',
      formats: ['es'],
    },
  },
};

export default config;
