<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type { WeatherResponse } from '$lib/types';
	import { appPreloader } from '$lib/preloader';

	import Cloud from '$lib/components/icons/Cloud.svelte';

	let data: WeatherResponse | undefined;
	let isLoadingLocation = false;
	let userLocation = { lat: 31.1048, lon: 77.1734, city: 'Shimla' }; // Default to Shimla, India
	let detectedLocation = { lat: 31.1048, lon: 77.1734, city: 'Shimla' }; // Will store user's detected location
	let isShimlaMode = true; // Track which location we're showing

	async function detectUserLocation() {
		if (!browser) return;
		
		try {
			// IP-based location detection for user's actual location
			const locationResponse = await fetch('https://ipinfo.io/json');
			const locationData = await locationResponse.json();
			
			if (locationData.loc) {
				// ipinfo.io returns coordinates as "lat,lon" string
				const [lat, lon] = locationData.loc.split(',').map(Number);
				detectedLocation = {
					lat: lat,
					lon: lon,
					city: locationData.city || locationData.region || locationData.country || 'Your Location'
				};
			}
		} catch (error) {
			console.log('IP location detection failed, user location will default to Shimla');
		}
	}

	async function fetchWeatherForCurrentLocation() {
		isLoadingLocation = true;
		try {
			const weatherResponse = await fetch(`/api/weather?lat=${userLocation.lat}&lon=${userLocation.lon}`);
			const weatherData = await weatherResponse.json();
			data = weatherData;
		} catch (error) {
			console.error('Weather fetch failed:', error);
		} finally {
			isLoadingLocation = false;
		}
	}

	function toggleWeatherLocation() {
		if (isShimlaMode) {
			// Switch to user's detected location
			userLocation = detectedLocation;
			isShimlaMode = false;
		} else {
			// Switch back to Shimla
			userLocation = { lat: 31.1048, lon: 77.1734, city: 'Shimla' };
			isShimlaMode = true;
		}
		fetchWeatherForCurrentLocation();
	}

	onMount(() => {
		// Check if weather data was preloaded
		const preloadedWeather = appPreloader.getPreloadedData('weather');
		if (preloadedWeather) {
			console.log('🚀 Using preloaded weather data:', preloadedWeather);
			data = preloadedWeather;
		} else {
			// Fallback to normal loading
			detectUserLocation();
			fetchWeatherForCurrentLocation();
		}
	});

	$: locationDisplayName = isShimlaMode ? 'Shimla' : 
		isLoadingLocation ? 'Loading...' : detectedLocation.city;

	const names: Record<string, string> = {
		'clear sky': 'clear skies',
		'few clouds': 'a few clouds',
		'scattered clouds': 'scattered clouds',
		'broken clouds': 'broken clouds',
		'shower rain': 'rain showers',
		rain: 'rain',
		thunderstorm: 'thunderstorms',
		snow: 'snow',
		mist: 'mist'
	};
</script>

<div class="mt-2 flex text-sm gap-2 items-center text-white">
	<div class={isLoadingLocation ? 'animate-pulse' : ''}>
		<Cloud />
	</div>

	<span>
		{#if isLoadingLocation}
			Loading weather...
		{:else if data}
			It's
			<b>{data.main?.temp?.toFixed(0)} °C</b> with
			{names[data.weather?.[0]?.description || ''] ?? data.weather?.[0]?.description}
			in
			<b>{data.name}</b>
		{:else}
			Weather unavailable
		{/if}
	</span>
	&middot;
	<button 
		on:click={toggleWeatherLocation}
		class="hidden md:flex items-center gap-1 text-gray-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
		disabled={isLoadingLocation}
		title="Toggle between Shimla and your location weather"
	>
		{locationDisplayName}
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
</div>

<style lang="postcss">
	b {
		@apply font-semibold;
	}
</style>
