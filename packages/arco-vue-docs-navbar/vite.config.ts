import { defineConfig, Plugin } from 'vite';
import svgr from './plugins/rollup-plugin-svgr';

function stubDocsearch(): Plugin {
  return {
    name: 'stub-docsearch',
    resolveId(id) {
      if (id === '@docsearch/react' || id.startsWith('@docsearch/react/')) {
        return '\0stub-docsearch';
      }
      return null;
    },
    load(id) {
      if (id === '\0stub-docsearch') {
        return [
          'export default function DocSearch() { return null; }',
          'export function AlgoliaLogo() { return null; }',
          'export function useSearchClient() { return null; }',
        ].join('\n');
      }
      return null;
    },
  };
}

export default defineConfig({
  mode: 'development',
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          prefix: 'arco-react',
        },
      },
    },
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: 'src/index.tsx',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.names?.[0] ?? assetInfo.name ?? '';
          return fileName.endsWith('.css') ? 'style.css' : '[name][extname]';
        },
      },
    },
  },
  plugins: [stubDocsearch(), svgr()],
});
