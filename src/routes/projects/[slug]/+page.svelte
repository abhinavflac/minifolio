<script>
	import Meta from '$lib/components/Meta.svelte';
	import ProjectLayout from '$lib/components/ProjectLayout.svelte';
	
	export let data;
	
	const { component: Component, metadata, error } = data;
	
	// Handle error case
	if (error) {
		console.error('Project loading error:', error);
	}
</script>

<Meta 
	title="{metadata.title} – Abhinav/gtms" 
	description={metadata.description}
/>

{#if Component}
	<ProjectLayout 
		{metadata} 
		hideDefaultHeader={metadata.hideDefaultHeader || false}
		customTitle={metadata.customTitle}
		customDescription={metadata.customDescription}
	>
		<svelte:component this={Component} />
	</ProjectLayout>
{:else}
	<ProjectLayout {metadata}>
		<div class="error-message">
			<h1>Project Not Found</h1>
			<p>The requested project could not be loaded.</p>
			{#if error}
				<p class="error-details">Error: {error}</p>
			{/if}
			<a href="/projects" class="back-link">← Back to Projects</a>
		</div>
	</ProjectLayout>
{/if}

<style>
	.error-message {
		text-align: center;
		padding: 2rem;
		color: #e5e7eb;
	}
	
	.error-message h1 {
		color: #ef4444;
		margin-bottom: 1rem;
	}
	
	.error-details {
		color: #9ca3af;
		font-size: 0.875rem;
		margin: 1rem 0;
	}
	
	.back-link {
		color: #3b82f6;
		text-decoration: none;
		font-weight: 500;
	}
	
	.back-link:hover {
		text-decoration: underline;
	}
</style>
