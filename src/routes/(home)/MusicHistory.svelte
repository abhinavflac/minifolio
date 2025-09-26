<script lang="ts">
	import { onMount } from 'svelte';
	import MusicalNote from '$lib/components/icons/MusicalNote.svelte';

	type Track = {
		name: string;
		artists: { name: string }[];
		album: {
			name: string;
			images: { url: string; width: number; height: number }[];
		};
		external_urls: {
			spotify: string;
		};
		popularity: number;
	};

	type TimeRange = 'short_term' | 'medium_term' | 'long_term';

	const timeRanges: { label: string; value: TimeRange }[] = [
		{ label: 'Today', value: 'short_term' },
		{ label: 'Past Month', value: 'short_term' },
		{ label: 'Past 6 Months', value: 'medium_term' },
		{ label: 'All Time', value: 'long_term' }
	];

	let tracks: Track[] = [];
	let loading = true;
	let error: string | null = null;
	let selectedTimeRange: TimeRange = 'short_term';
	let activeTab = 0;

	async function fetchTopTracks(timeRange: TimeRange) {
		try {
			loading = true;
			error = null;
			
			const response = await fetch(`/api/top-tracks?time_range=${timeRange}`);
			
			if (!response.ok) {
				throw new Error('Failed to fetch top tracks');
			}
			
			tracks = await response.json();
		} catch (err) {
			console.error('Error fetching top tracks:', err);
			error = err instanceof Error ? err.message : 'Unknown error occurred';
			tracks = [];
		} finally {
			loading = false;
		}
	}

	function selectTimeRange(index: number, timeRange: TimeRange) {
		activeTab = index;
		selectedTimeRange = timeRange;
		fetchTopTracks(timeRange);
	}

	onMount(() => {
		fetchTopTracks(selectedTimeRange);
	});
</script>

<div class="mt-8">
	<div class="flex items-center gap-2 mb-2">
		<MusicalNote />
		<h2 class="text-xl font-semibold text-white">Music</h2>
	</div>
	
	<p class="text-gray-400 mb-6">Tracks I've listened to the most on Spotify.</p>

	<!-- Time Range Tabs -->
	<div class="flex gap-1 mb-6 bg-gray-900 rounded-lg p-1">
		{#each timeRanges as { label, value }, index}
			<button
				class="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 {activeTab === index
					? 'bg-white text-black'
					: 'text-gray-400 hover:text-white hover:bg-gray-800'}"
				on:click={() => selectTimeRange(index, value)}
			>
				{label}
			</button>
		{/each}
	</div>

	<!-- Content -->
	{#if loading}
		<div class="flex items-center justify-center py-8">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
		</div>
	{:else if error}
		<div class="bg-red-900/20 border border-red-500/20 rounded-lg p-4">
			<p class="text-red-400">Failed to load tracks: {error}</p>
		</div>
	{:else if tracks.length === 0}
		<div class="bg-gray-900 rounded-lg p-6 text-center">
			<p class="text-gray-400">No tracks found for this time period.</p>
		</div>
	{:else}
		<div class="space-y-3">
			{#each tracks as track, index}
				<a 
					href={track.external_urls.spotify} 
					target="_blank" 
					rel="noopener noreferrer"
					class="flex items-center bg-gray-900 hover:bg-gray-800 rounded-lg p-3 transition-colors duration-200 group"
				>
					<div class="w-6 text-center text-gray-500 text-sm font-medium mr-3">
						{index + 1}
					</div>
					
					<div class="relative shrink-0">
						{#if track.album.images.length > 0}
							<img 
								src={track.album.images[track.album.images.length - 1].url} 
								alt={track.album.name}
								class="w-12 h-12 rounded-md"
								loading="lazy"
							/>
						{:else}
							<div class="w-12 h-12 rounded-md bg-gray-800 flex items-center justify-center">
								<div class="w-6 h-6 text-gray-600">
									<MusicalNote />
								</div>
							</div>
						{/if}
					</div>
					
					<div class="ml-3 flex-1 min-w-0">
						<p class="font-medium text-white truncate group-hover:text-green-400 transition-colors">
							{track.name}
						</p>
						<p class="text-sm text-gray-400 truncate">
							{track.artists.map(artist => artist.name).join(', ')}
						</p>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
