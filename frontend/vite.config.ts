import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

/** The Django API (backend/) serves /api; same origin in dev and preview so cookies need no CORS setup. */
const proxy = { '/api': process.env.API_URL ?? 'http://localhost:8000' };

export default defineConfig({
	server: { proxy },
	preview: { proxy },
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
			// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
			// See https://svelte.dev/docs/kit/adapters for more information about adapters.
			adapter: adapter({ fallback: '404.html' }),
			prerender: { handleMissingId: 'ignore' } // #rules / #overview are view hashes, not element ids
		})
	]
});
