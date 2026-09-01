import fs from 'fs';
import type { Plugin } from 'vite';
import svgr from '@svgr/core';
import { transform } from 'esbuild';

export default function svgrPlugin(): Plugin {
  return {
    name: 'vite:svgr',
    async transform(_code, id) {
      if (!id.endsWith('.svg')) {
        return null;
      }
      const svg = await fs.promises.readFile(id, 'utf8');
      const componentCode = await svgr(svg, {}, {});
      const res = await transform(componentCode, {
        loader: 'jsx',
      });
      return {
        code: res.code,
      };
    },
  };
}
