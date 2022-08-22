import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import Unocss from 'unocss/vite'

// https://astro.build/config
export default defineConfig({
	site: 'https://leniency.github.io',
	// Enable Vue to support Vue components.
	integrations: [vue()],
	vite: {
		plugins: [
			Unocss()
		],
	},
});