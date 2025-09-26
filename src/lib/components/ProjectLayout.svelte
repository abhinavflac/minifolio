<script>
	import GitHubFilesBrowser from './GitHubFilesBrowser.svelte';
	import ExpandableImage from './ExpandableImage.svelte';
	import ImageEnhancer from './ImageEnhancer.svelte';
	import { onMount } from 'svelte';
	
	export let metadata;
	export let hideDefaultHeader = false;
	export let customTitle = null;
	export let customDescription = null;
	
	let showGoToTop = false;
	
	// Make components available globally
	if (typeof window !== 'undefined') {
		window.GitHubFilesBrowser = GitHubFilesBrowser;
		window.ExpandableImage = ExpandableImage;
	}
	
	onMount(() => {
		const handleScroll = () => {
			showGoToTop = window.scrollY > 300;
		};
		
		window.addEventListener('scroll', handleScroll);
		
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
	
	function scrollToTop() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}
</script>

<main class="wrapper fade">
	<article class="max-w-4xl mx-auto">
		<!-- Projects Button -->
		<div class="mb-6">
			<button 
				class="projects-btn"
				on:click={() => window.history.back()}
				aria-label="Go to Projects"
				title="Go to Projects"
			>
				<svg 
					xmlns="http://www.w3.org/2000/svg" 
					fill="none" 
					viewBox="0 0 24 24" 
					stroke-width="1.5" 
					stroke="currentColor" 
					class="w-3 h-3"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
				<span>Projects</span>
			</button>
		</div>

		<!-- Project Header -->
		<header class="mb-8">
			{#if !hideDefaultHeader}
				<div class="mb-4">
					<h1 class="header">{customTitle || metadata.title}</h1>
				</div>
				
				<p class="text-gray-400 text-lg mb-6">{customDescription || metadata.description}</p>
			{/if}
			
			{#if metadata.technologies}
				<div class="flex flex-wrap gap-2 mb-6">
					{#each metadata.technologies as tech}
						<span class="px-3 py-1 text-gray-300 rounded-full text-sm glassmorphism-tech">
							{tech}
						</span>
					{/each}
				</div>
			{/if}
		</header>

		<!-- GitHub Files Browser -->
		{#if metadata.github}
			<div class="mb-8">
				<GitHubFilesBrowser 
					repoUrl={metadata.github}
					title="Project Files"
				/>
			</div>
		{/if}

		<!-- Project Content -->
		<div class="prose prose-invert max-w-none">
			<slot />
		</div>
		
		<!-- Image Enhancer for automatic image expansion -->
		<ImageEnhancer />
	</article>
	
	<!-- Go to Top Button -->
	{#if showGoToTop}
		<button 
			class="go-to-top-btn"
			on:click={scrollToTop}
			aria-label="Go to top"
			title="Go to top"
		>
			<svg 
				xmlns="http://www.w3.org/2000/svg" 
				fill="none" 
				viewBox="0 0 24 24" 
				stroke-width="1.5" 
				stroke="currentColor" 
				class="w-5 h-5"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
			</svg>
		</button>
	{/if}
</main>

<style>
	.projects-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 1rem;
		border-radius: 9999px;
		border: none;
		cursor: pointer;
		font-size: 0.75rem;
		font-weight: 500;
		transition: all 0.3s ease;
		
		/* Glassmorphism effects */
		background: rgba(255, 255, 255, 0.025);
		backdrop-filter: blur(5px);
		border: 1px solid rgba(255, 255, 255, 0.05);
		color: rgba(255, 255, 255, 0.8);
		
		/* Shadow effects */
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
	}
	
	.projects-btn:hover {
		/* Hover state enhancements */
		background: rgba(255, 255, 255, 0.04);
		border-color: rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 1);
		transform: translateY(-1px);
		box-shadow:
			0 8px 12px -1px rgba(0, 0, 0, 0.15),
			0 4px 8px -1px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.075);
	}
	
	.projects-btn:active {
		transform: translateY(0);
	}
	
	.projects-btn svg {
		transition: transform 0.2s ease;
	}
	
	.projects-btn:hover svg {
		transform: translateX(-2px);
	}

	.go-to-top-btn {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		transition: all 0.3s ease;
		
		/* Glassmorphism effects */
		background: rgba(255, 255, 255, 0.025);
		backdrop-filter: blur(5px);
		border: 1px solid rgba(255, 255, 255, 0.05);
		color: rgba(255, 255, 255, 0.8);
		
		/* Shadow effects */
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
	}
	
	.go-to-top-btn:hover {
		/* Hover state enhancements */
		background: rgba(255, 255, 255, 0.04);
		border-color: rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 1);
		transform: translateY(-2px);
		box-shadow:
			0 8px 12px -1px rgba(0, 0, 0, 0.15),
			0 4px 8px -1px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.075);
	}
	
	.go-to-top-btn:active {
		transform: translateY(0);
	}
	
	/* Responsive positioning */
	@media (max-width: 768px) {
		.go-to-top-btn {
			bottom: 1.5rem;
			right: 1.5rem;
			width: 2.5rem;
			height: 2.5rem;
		}
		
		.go-to-top-btn svg {
			width: 1.25rem;
			height: 1.25rem;
		}
	}
</style>
