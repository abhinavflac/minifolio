<script lang="ts">
	import { now, timezone } from '$lib/stores';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import Sun from '$lib/components/icons/Sun.svelte';
	import Moon from '$lib/components/icons/Moon.svelte';

	// Get user's timezone via IP location detection
	let userTimezone = 'UTC';
	let userLocation = 'Local';
	let isLoadingLocation = false;

	async function detectTimezoneFromIP() {
		if (!browser) return;
		
		isLoadingLocation = true;
		try {
			// IP-based location detection
			const response = await fetch('https://ipinfo.io/json');
			const data = await response.json();
			
			if (data.timezone) {
				userTimezone = data.timezone;
				userLocation = data.city ? `${data.city}, ${data.country}` : data.country || 'Local';
			} else {
				// Fallback to browser timezone
				userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
				userLocation = userTimezone.split('/').pop()?.replace('_', ' ') || 'Local';
			}
		} catch (error) {
			console.log('IP location detection failed, using browser timezone');
			// Fallback to browser timezone detection
			userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			userLocation = userTimezone.split('/').pop()?.replace('_', ' ') || 'Local';
		} finally {
			isLoadingLocation = false;
		}
	}

	onMount(() => {
		detectTimezoneFromIP();
	});

	$: df = new Intl.DateTimeFormat('en-US', {
		day: 'numeric',
		year: 'numeric',
		month: 'long',
		timeZone: $timezone
	});

	$: tf = new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		timeZone: $timezone,
		timeZoneName: 'short'
	});

	// Calculate if it's day/night based on selected timezone
	$: {
		const date = new Date($now);
		const timeInTimezone = new Date(date.toLocaleString('en-US', { timeZone: $timezone }));
		const hours = timeInTimezone.getHours();
		isDay = hours >= 6 && hours < 18;
	}

	let isDay = true;

	function toggleTimezone() {
		if ($timezone === 'Asia/Kolkata') {
			timezone.set(userTimezone);
		} else {
			timezone.set('Asia/Kolkata');
		}
	}

	$: timezoneDisplayName = $timezone === 'Asia/Kolkata' ? 'India' : 
		isLoadingLocation ? 'Loading...' : userLocation;
</script>

<p class="mt-8 flex text-sm gap-2 items-center text-white">
	{#if isDay}
		<Sun />
	{:else}
		<Moon />
	{/if}

	{df.format($now)}
	&middot;
	{tf.format($now)}
	&middot;
	<button 
		on:click={toggleTimezone}
		class="hidden md:flex items-center gap-1 text-gray-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
		disabled={isLoadingLocation}
		title="Toggle between India and your location timezone"
	>
		{timezoneDisplayName}
		<svg 
			class="w-3 h-3 transition-transform duration-200" 
			class:animate-spin={isLoadingLocation}
			fill="none" 
			stroke="currentColor" 
			viewBox="0 0 24 24"
		>
			{#if isLoadingLocation}
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
			{:else}
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l5-5 5 5" />
			{/if}
		</svg>
	</button>
</p>
