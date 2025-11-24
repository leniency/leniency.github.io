import { ViteUserConfig, defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import icon from "astro-icon";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  site: 'https://chronoclast.com',
  trailingSlash: 'ignore',
  integrations: [
    mdx(),
    preact(),
    icon()
  ],
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
  } as ViteUserConfig
});