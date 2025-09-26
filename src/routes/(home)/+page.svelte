<script lang="ts">
	import Clock from './Clock.svelte';
	import DiscordInfo from './DiscordInfo.svelte';
	import SocialLink from './SocialLink.svelte';
	import SpotifyInfo from './SpotifyInfo.svelte';
	import Weather from './Weather.svelte';
	import { useLanyard } from 'sk-lanyard';

	import GitHub from '$lib/components/icons/GitHub.svelte';
	import Envelope from '$lib/components/icons/Envelope.svelte';
	import Linkedin from '$lib/components/icons/Linkedin.svelte';
	import Twitter from '$lib/components/icons/Twitter.svelte';
	import Meta from '$lib/components/Meta.svelte';

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
</script>

<Meta title="Abhinav/gtms" description="My portfolio and personal website." />

<main class="wrapper fade">
	<div class="flex items-baseline gap-2">
		<h1 class="header">Abhinav/gtms</h1>
		{#if $lanyard}
			<div 
				class="w-3 h-3 rounded-full {statusColors[$lanyard.discord_status]}"
				title="Discord Status: {$lanyard.discord_status}"
			/>
		{:else}
			<div 
				class="w-3 h-3 rounded-full bg-gray-600"
				title="Discord Status: Loading..."
			/>
		{/if}
	</div>

	<p class="mt-4 text-gray-400">
		I'm Abhinav, an AI &amp; Data Science Specialist
		passionate about building scalable, AI-driven solutions. With expertise in 
		<code class="inline-code">Data Analytics,</code> 
		<code class="inline-code">Data Science,</code> and 
		<code class="inline-code">Machine Learning,</code> 
		I create impactful user experiences and explore innovative projects in my free time.
	</p>

	<div class="mt-4 flex gap-6">
		<SocialLink href="https://github.com/GithubMaster-IN" name="GitHub">
			<GitHub />
		</SocialLink>

		<SocialLink
			href="https://www.linkedin.com/in/GithubMaster"
			name="LinkedIn"
		>
			<Linkedin />
		</SocialLink>

		<SocialLink href="https://twitter.com/GithubMasterIN" name="Twitter">
			<Twitter />
		</SocialLink>

		<!-- <SocialLink
			href="https://open.spotify.com/user/22ah5au2dajm7rqn3znkf4tnq?si=95e89d77cb0046f5"
			name="Spotify"
		>
			<Spotify />
		</SocialLink> -->

		<SocialLink href="mailto:githubmasterin@gmail.com" name="Email">
			<Envelope />
		</SocialLink>
	</div>

	<Clock />
	<Weather />

	<DiscordInfo />
	<SpotifyInfo />
</main>
