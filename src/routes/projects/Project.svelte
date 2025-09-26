<script lang="ts">
	export let name: string;
	export let href: string;
	export let src: string;
	
	// Check if it's an external link
	const isExternal = href.startsWith('http');
</script>

<div class="mt-4">
	<a
		{href}
		target={isExternal ? '_blank' : undefined}
		rel={isExternal ? 'noopener noreferrer' : undefined}
		class="project-card"
	>
		<div class="project-content">
			<h2 class="font-bold text-2xl">{name}</h2>

			<p class="mt-2 text-gray-400">
				<slot />
			</p>
		</div>

		<div class="project-image">
			<img
				{src}
				alt=""
				class="absolute top-0 left-0 w-full h-full object-cover"
			/>
		</div>
	</a>
</div>

<style>
	.project-card {
		display: grid;
		grid-template-columns: 1fr;
		border-radius: 1rem; /* rounded-2xl */
		overflow: hidden;
		transition: all 0.3s ease;
		
		/* Glassmorphism background effects */
		background: rgba(255, 255, 255, 0.025);
		backdrop-filter: blur(5px);
		border: 1px solid rgba(255, 255, 255, 0.05);
		
		/* Shadow effects */
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
	}
	
	.project-card:hover {
		/* Hover state enhancements */
		background: rgba(255, 255, 255, 0.04);
		border-color: rgba(255, 255, 255, 0.1);
		transform: scale(1.02);
		box-shadow:
			0 8px 12px -1px rgba(0, 0, 0, 0.15),
			0 4px 8px -1px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.075);
	}
	
	.project-content {
		padding: 1.5rem 2rem; /* p-6 md:p-8 */
		background: rgba(255, 255, 255, 0.01);
		backdrop-filter: blur(2.5px);
		border-right: 1px solid rgba(255, 255, 255, 0.05);
	}
	
	.project-image {
		position: relative;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.01);
		backdrop-filter: blur(2.5px);
		border-left: 1px solid rgba(255, 255, 255, 0.05);
	}
	
	/* Responsive design */
	@media (min-width: 640px) {
		.project-card {
			grid-template-columns: 1fr 1fr; /* sm:grid-cols-2 */
		}
		
		.project-content {
			order: 1;
		}
		
		.project-image {
			order: 2;
		}
	}
	
	@media (max-width: 639px) {
		.project-content {
			order: 2; /* max-sm:row-start-2 */
		}
		
		.project-image {
			order: 1;
			height: 6rem; /* max-sm:h-24 */
		}
	}
</style>
