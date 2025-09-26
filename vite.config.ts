import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 5173,
		host: true
	},
	preview: {
		port: 4173,
		host: true
	},
	build: {
		sourcemap: true,
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					// Vendor chunks
					if (id.includes('node_modules')) {
						if (id.includes('svelte')) return 'svelte';
						if (id.includes('@sveltejs')) return 'sveltekit';
						if (id.includes('@spotify')) return 'spotify';
						if (id.includes('sk-lanyard')) return 'lanyard';
						return 'vendor';
					}
					
					// Route chunks
					if (id.includes('/src/routes/')) {
						if (id.includes('/projects/')) return 'projects';
						if (id.includes('/music')) return 'music';
						if (id.includes('/(home)')) return 'home';
						return 'routes';
					}
					
					// Component chunks
					if (id.includes('/src/lib/components/')) {
						if (id.includes('icons/')) return 'icons';
						return 'components';
					}
					
					// API chunks
					if (id.includes('/src/routes/api/')) return 'api';
					
					return 'misc';
				}
			}
		}
	},
	optimizeDeps: {
		include: [
			'svelte',
			'@sveltejs/kit',
			'@spotify/web-api-ts-sdk',
			'sk-lanyard'
		]
	}
});
