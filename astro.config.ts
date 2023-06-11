import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  //site: 'https://leniency.github.io',
  site: 'https://chronoclast.com',
  trailingSlash: 'ignore',
  integrations: [mdx(), preact()],
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: id => {
            // console.log(`Chunky ${id.substring(id.indexOf('node_modules'))}`);
            if (id.includes('node_modules/babylon') || id.includes('node_modules/@babylon')) {
              return 'babylon';
            } else if (id.includes('node_modules/melonjs')) {
              return 'melon';
            }
          }
        }
      }
    }
  }
});