<script lang="ts">
	import { page } from '$app/stores';

	export let href: string;

	$: active = href === $page.url.pathname;
</script>

<li>
	<a {href} class="nav-link {active ? 'text-white active' : 'text-primary-300'}">
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
		will-change: transform;
		transform-origin: left;
		text-transform: lowercase;
		transition: all 0.3s ease;
	}

	.nav-link:hover {
		transform: scaleX(1.15);
		color: white;
	}

	.nav-link::after {
		position: absolute;
		content: "";
		bottom: -2.25px;
		width: 40%;
		height: 2.25px;
		background-color: hsl(var(--primary-300));
		transition: width 0.3s ease;
	}

	.nav-link:hover::after,
	.nav-link.active::after {
		width: 100%;
	}
</style>
