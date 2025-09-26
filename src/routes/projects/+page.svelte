<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import Project from './Project.svelte';
</script>

<Meta title="Projects – Abhinav/gtms" description="My projects." />

<main class="wrapper fade">
	<h1 class="header">Projects</h1>

	<p class="mt-4 mb-8 text-gray-400">Some of my projects.</p>

	<Project
	name="Alaska Water Analysis"
	href="/projects/alaska-water-analysis"
	src="/images/projects/project-01/hydrochemical.png"
>
	Analysis of hydrochemical data in Alaska using clustering techniques.
</Project>

<Project
	name="StageFit"
	href="/projects/stagefit"
	src="/images/projects/project-02/stagefit.png"
>
	A comprehensive fitness and wellness management system built with Python and Streamlit
</Project>
</main>
