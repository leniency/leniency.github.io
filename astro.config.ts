import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
    site: 'https://leniency.github.io',

    integrations: [
        mdx()
    ],

    vite: {
        build: {
            rollupOptions: {
                output: {
                    manualChunks: (id) => {
                        // console.log(`Chunky ${id.substring(id.indexOf('node_modules'))}`);
                        if (id.includes('node_modules/babylon')) {
                            return 'babylon';
                        }
                    }
                }
            }
        }
    }
});