<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { appPreloader } from '$lib/preloader';

	export let href: string;

	$: active = href === $page.url.pathname;

	// Prefetch route on hover (only in browser)
	function handleMouseEnter() {
		if (browser) {
			appPreloader.prefetchRoute(href);
		}
	}
</script>

<li>
	<a 
		{href} 
		class="nav-link {active ? 'text-white active' : 'text-primary-300'}"
		on:mouseenter={handleMouseEnter}
	>
		<slot />
	</a>
</li>

<style>
	.nav-link {
		position: relative;
		display: inline-flex;
		text-decoration: none;
		width: fit-content;
		font-style: italic;
		will-change: transform, color;
		transform-origin: left;
		text-transform: lowercase;
		transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
		            color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		perspective: 1000px;
		-webkit-perspective: 1000px;
	}

	.nav-link:hover {
		transform: scaleX(1.15);
		color: white;
	}

	.nav-link::after {
		position: absolute;
		content: "";
		bottom: -2.25px;
		left: 0;
		width: 100%;
		height: 2.25px;
		background-color: hsl(var(--primary-300));
		transform: scaleX(0.4);
		transform-origin: left;
		transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		will-change: transform;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
	}

	.nav-link:hover::after,
	.nav-link.active::after {
		transform: scaleX(1);
	}

	/* Mobile optimizations for touch devices */
	@media (hover: none) and (pointer: coarse) {
		.nav-link {
			transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
			            color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		}
		
		.nav-link::after {
			transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		}
	}

	/* High refresh rate displays (120Hz+) */
	@media (min-resolution: 120dpi) {
		.nav-link {
			transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
			            color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		}
		
		.nav-link::after {
			transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		}
	}
</style>
