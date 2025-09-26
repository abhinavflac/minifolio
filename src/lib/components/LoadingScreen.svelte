<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	export let progress = 0;
	export let message = 'Loading...';
	export let show = true;

	let mounted = false;
	let progressBar: HTMLDivElement;

	onMount(() => {
		mounted = true;
	});

	// Animate progress bar
	$: if (mounted && progressBar) {
		progressBar.style.width = `${progress}%`;
	}
</script>

{#if show}
	<div 
		class="loading-screen"
		class:loaded={progress >= 100}
		transition:fade={{ duration: 300, easing: cubicOut }}
	>
		<div class="loading-container">
			<!-- Animated Logo -->
			<div 
				class="logo-container"
				in:fly={{ y: -50, duration: 800, delay: 200, easing: cubicOut }}
			>
				<div class="logo">
					<div class="logo-text">Abhinav/gtms</div>
					<div class="logo-subtitle">AI & Data Science Specialist</div>
				</div>
			</div>

			<!-- Progress Section -->
			<div 
				class="progress-section"
				in:fly={{ y: 30, duration: 600, delay: 400, easing: cubicOut }}
			>
				<div class="progress-container">
					<div class="progress-bar-bg">
						<div 
							bind:this={progressBar}
							class="progress-bar"
						></div>
					</div>
					<div class="progress-text">
						<span class="progress-percentage">{Math.round(progress)}%</span>
						<span class="progress-message">{message}</span>
					</div>
				</div>
			</div>

			<!-- Loading Animation -->
			<div 
				class="loading-animation"
				in:fly={{ y: 20, duration: 500, delay: 600, easing: cubicOut }}
			>
				<div class="loading-dots">
					<div class="dot"></div>
					<div class="dot"></div>
					<div class="dot"></div>
				</div>
			</div>
		</div>

		<!-- Background Effects -->
		<div class="bg-effects">
			<div class="bg-gradient"></div>
			<div class="bg-particles">
				{#each Array(20) as _, i}
					<div 
						class="particle" 
						style="--delay: {i * 0.1}s; --x: {Math.random() * 100}%; --y: {Math.random() * 100}%"
					></div>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	.loading-screen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
		overflow: hidden;
	}

	.loading-screen.loaded {
		opacity: 0;
		pointer-events: none;
	}

	.loading-container {
		text-align: center;
		z-index: 2;
		position: relative;
	}

	.logo-container {
		margin-bottom: 3rem;
	}

	.logo {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.logo-text {
		font-size: 3rem;
		font-weight: 900;
		background: linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #f59e0b 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-shadow: 0 0 30px rgba(147, 51, 234, 0.3);
		animation: logoGlow 2s ease-in-out infinite alternate;
	}

	.logo-subtitle {
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.7);
		font-weight: 300;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.progress-section {
		margin-bottom: 2rem;
	}

	.progress-container {
		width: 300px;
		margin: 0 auto;
	}

	.progress-bar-bg {
		width: 100%;
		height: 4px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 2px;
		overflow: hidden;
		margin-bottom: 1rem;
	}

	.progress-bar {
		height: 100%;
		background: linear-gradient(90deg, #9333ea 0%, #ec4899 50%, #f59e0b 100%);
		border-radius: 2px;
		transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 0 10px rgba(147, 51, 234, 0.5);
	}

	.progress-text {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.8);
	}

	.progress-percentage {
		font-weight: 600;
		color: #9333ea;
	}

	.progress-message {
		font-weight: 300;
	}

	.loading-animation {
		margin-top: 1rem;
	}

	.loading-dots {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
	}

	.dot {
		width: 8px;
		height: 8px;
		background: #9333ea;
		border-radius: 50%;
		animation: dotPulse 1.4s ease-in-out infinite both;
	}

	.dot:nth-child(1) { animation-delay: -0.32s; }
	.dot:nth-child(2) { animation-delay: -0.16s; }
	.dot:nth-child(3) { animation-delay: 0s; }

	.bg-effects {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.bg-gradient {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: radial-gradient(circle at 30% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
		            radial-gradient(circle at 70% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
		animation: gradientShift 8s ease-in-out infinite;
	}

	.bg-particles {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.particle {
		position: absolute;
		width: 2px;
		height: 2px;
		background: rgba(147, 51, 234, 0.6);
		border-radius: 50%;
		left: var(--x);
		top: var(--y);
		animation: particleFloat 6s linear infinite;
		animation-delay: var(--delay);
	}

	@keyframes logoGlow {
		0% { text-shadow: 0 0 30px rgba(147, 51, 234, 0.3); }
		100% { text-shadow: 0 0 50px rgba(147, 51, 234, 0.6), 0 0 80px rgba(236, 72, 153, 0.3); }
	}

	@keyframes dotPulse {
		0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
		40% { transform: scale(1.2); opacity: 1; }
	}

	@keyframes gradientShift {
		0%, 100% { opacity: 0.3; }
		50% { opacity: 0.6; }
	}

	@keyframes particleFloat {
		0% { transform: translateY(0) rotate(0deg); opacity: 0; }
		10% { opacity: 1; }
		90% { opacity: 1; }
		100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
	}

	/* Responsive Design */
	@media (max-width: 640px) {
		.logo-text {
			font-size: 2.5rem;
		}
		
		.progress-container {
			width: 250px;
		}
	}
</style>
