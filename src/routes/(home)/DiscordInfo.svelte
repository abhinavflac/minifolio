<script lang="ts">
	import { useLanyard } from 'sk-lanyard';
	import { onMount, onDestroy } from 'svelte';
	import { appPreloader } from '$lib/preloader';

	import Discord from '$lib/components/icons/Discord.svelte';

	const discordId = '1107241247086739537';
	const lanyard = useLanyard({
		method: 'rest',
		id: discordId
	});

	const statusColors: Record<string, string> = {
		online: 'bg-emerald-500',
		idle: 'bg-amber-400',
		dnd: 'bg-rose-400',
		offline: 'bg-gray-600'
	};

	$: customStatus = $lanyard?.activities.find(a => a.type === 4);
	// $: location = $lanyard?.kv?.location ? JSON.parse($lanyard.kv.location) : null;
	$: activeClients = $lanyard ? [
		$lanyard.active_on_discord_desktop && 'Desktop',
		$lanyard.active_on_discord_mobile && 'Mobile'
	].filter(Boolean) : [];
	// @ts-ignore - primary_guild exists in the API response
	$: guildTag = $lanyard?.discord_user?.primary_guild?.tag;
	$: currentActivities = $lanyard?.activities.filter(a => a.type !== 4 && a.name !== 'Spotify') || [];
	
	// Helper function to get display name
	function getDisplayName(user: any) {
		return user.display_name || user.global_name || user.username;
	}
	
	// Helper function to get emoji from custom status
	function getCustomStatusEmoji(status: any) {
		return status?.emoji;
	}

	let currentTime = Date.now();
	let timeInterval: ReturnType<typeof setInterval>;

	onMount(() => {
		// Check if Discord data was preloaded
		const preloadedDiscord = appPreloader.getPreloadedData('discord');
		if (preloadedDiscord) {
			console.log('🚀 Using preloaded Discord data:', preloadedDiscord);
			// Note: sk-lanyard manages its own state, so we can't directly inject data
			// But we can use the preloaded data for fallback or display
		}
		
		timeInterval = setInterval(() => {
			currentTime = Date.now();
		}, 1000);
	});

	onDestroy(() => {
		if (timeInterval) {
			clearInterval(timeInterval);
		}
	});

	function formatElapsedTime(startTimestamp: number): string {
		const elapsed = Math.floor((currentTime - startTimestamp) / 1000);
		
		if (elapsed < 60) {
			return `${elapsed}s`;
		} else if (elapsed < 3600) {
			const minutes = Math.floor(elapsed / 60);
			const seconds = elapsed % 60;
			return `${minutes}m ${seconds}s`;
		} else {
			const hours = Math.floor(elapsed / 3600);
			const minutes = Math.floor((elapsed % 3600) / 60);
			return `${hours}h ${minutes}m`;
		}
	}

	function openDiscordProfile() {
		window.open(`https://discord.com/users/${discordId}`, '_blank');
	}
</script>

<div class="mt-8 flex flex-col lg:flex-row gap-4">
	<!-- Discord Status Section (Left Side on desktop, Top on mobile) -->
	<button 
		class="discord-card flex rounded-full items-center flex-1 cursor-pointer text-left"
		on:click={openDiscordProfile}
		aria-label="Open Discord profile"
	>
		<div class="relative w-20 h-20 shrink-0 rounded-full">
			{#if $lanyard}
				<object
					data="https://cdn.discordapp.com/avatars/{discordId}/{$lanyard
						.discord_user.avatar}.png?size=128"
					type="image/png"
					class="w-20 h-20 rounded-full bg-gray-800 text-gray-400 grid place-items-center"
					aria-label="Discord Avatar"
				>
					<Discord />
				</object>

				<span
					class="z-10 absolute w-4 h-4 bottom-1 right-1 rounded-full ring-4 ring-gray-900
						{statusColors[$lanyard.discord_status]}"
				/>
			{:else}
				<div
					class="w-20 h-20 rounded-full bg-gray-800 text-gray-400 grid place-items-center"
				>
					<Discord />
				</div>
			{/if}
		</div>

		<div class="ml-4 py-2 pr-6 flex-1">
			<p class="line-clamp-1 break-all text-gray-400">
				{#if $lanyard}
					<span class="font-semibold text-white">
						{getDisplayName($lanyard.discord_user)}
					</span>

					<span class="ml-1">
						@{$lanyard.discord_user.username}
					</span>
				{/if}
			</p>

			{#if customStatus}
				{@const emoji = getCustomStatusEmoji(customStatus)}
				<p class="flex items-center text-sm mt-1">
					{#if emoji}
						{#if emoji.id}
							<img
								src="https://cdn.discordapp.com/emojis/{emoji.id}.png"
								alt=""
								class="w-4 h-4 mr-1"
							/>
						{:else}
							<span class="mr-1">{emoji.name}</span>
						{/if}
					{/if}

					<span class="line-clamp-1 break-all text-gray-300">
						{customStatus.state || ''}
					</span>
				</p>
			{/if}

			{#if activeClients.length > 0}
				<p class="text-xs text-gray-500 mt-1">
					Active on: {activeClients.join(', ')}
				</p>
			{/if}
		</div>
	</button>

	<!-- Current Activities Section (Right Side on desktop, Bottom on mobile) -->
	{#if currentActivities.length > 0}
		<div class="flex-1">
			{#each currentActivities as activity}
				<div class="discord-activity flex rounded-full items-center p-4 h-full">
					{#if activity.assets?.large_image}
						<img
							src={activity.assets.large_image.startsWith('mp:') 
								? `https://media.discordapp.net/${activity.assets.large_image.slice(3)}`
								: `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`}
							alt=""
							class="w-16 h-16 rounded-lg shrink-0"
						/>
					{/if}
					<div class="ml-4 flex-1 min-w-0">
						<div class="flex items-center justify-between">
							<p class="font-semibold text-white text-lg truncate">{activity.name}</p>
							{#if activity.timestamps?.start}
								<span class="text-xs text-gray-500 ml-2 shrink-0">
									{formatElapsedTime(activity.timestamps.start)}
								</span>
							{/if}
						</div>
						{#if activity.details}
							<p class="text-sm text-gray-400 truncate">{activity.details}</p>
						{/if}
						{#if activity.state}
							<p class="text-sm text-gray-500 truncate">{activity.state}</p>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style lang="postcss">
	.discord-card {
		/* Glassmorphism background effects */
		background: rgba(255, 255, 255, 0.025);
		backdrop-filter: blur(5px);
		border: 1px solid rgba(255, 255, 255, 0.05);
		
		/* Shadow effects */
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
		
		transition: all 0.3s ease;
	}
	
	.discord-card:hover {
		/* Hover state enhancements */
		background: rgba(255, 255, 255, 0.04);
		border-color: rgba(255, 255, 255, 0.1);
		box-shadow:
			0 8px 12px -1px rgba(0, 0, 0, 0.15),
			0 4px 8px -1px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.075);
	}
	
	.discord-activity {
		/* Glassmorphism background effects */
		background: rgba(255, 255, 255, 0.025);
		backdrop-filter: blur(5px);
		border: 1px solid rgba(255, 255, 255, 0.05);
		
		/* Shadow effects */
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
		
		transition: all 0.3s ease;
	}
	
	.discord-activity:hover {
		/* Hover state enhancements */
		background: rgba(255, 255, 255, 0.04);
		border-color: rgba(255, 255, 255, 0.1);
		box-shadow:
			0 8px 12px -1px rgba(0, 0, 0, 0.15),
			0 4px 8px -1px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.075);
	}
</style>
