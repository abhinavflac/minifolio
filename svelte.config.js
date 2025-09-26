import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.mdx'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.mdx']
		})
	],

	kit: {
		adapter: adapter()
	}
};

export default config;
