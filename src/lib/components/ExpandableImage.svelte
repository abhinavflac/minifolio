<script>
	export let src;
	export let alt;
	
	let showModal = false;
	let isClosing = false;
	
	function openModal() {
		showModal = true;
		isClosing = false;
		document.body.style.overflow = 'hidden';
	}
	
	function closeModal() {
		if (isClosing) return;
		isClosing = true;
		
		// Wait for animation to complete before hiding modal
		setTimeout(() => {
			showModal = false;
			isClosing = false;
			document.body.style.overflow = 'auto';
		}, 300); // Match the animation duration
	}
	
	function handleKeydown(event) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Thumbnail Image -->
<img 
	{src} 
	{alt} 
	class="expandable-image" 
	on:click={openModal}
	on:keydown={(e) => e.key === 'Enter' && openModal()}
	tabindex="0"
	role="button"
	aria-label="Click to expand image"
/>

<!-- Modal -->
{#if showModal}
	<div class="image-modal" class:closing={isClosing} on:click={closeModal}>
		<div class="modal-content" class:closing={isClosing} on:click|stopPropagation>
			<button class="close-btn" on:click={closeModal}>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
					<path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
				</svg>
			</button>
			<img {src} {alt} class="expanded-image" />
		</div>
	</div>
{/if}

<style>
	.expandable-image {
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		border-radius: 1.5rem;
		margin: 1.5rem 0;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.1);
		transform-origin: center;
	}
	
	.expandable-image:hover {
		transform: scale(1.03);
		box-shadow:
			0 12px 20px -1px rgba(0, 0, 0, 0.2),
			0 8px 16px -1px rgba(0, 0, 0, 0.15);
	}
	
	.expandable-image:focus {
		outline: 2px solid rgba(59, 130, 246, 0.5);
		outline-offset: 4px;
	}
	
	.image-modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0);
		backdrop-filter: blur(0px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 2rem;
		animation: modalFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}
	
	.image-modal.closing {
		animation: modalFadeOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}
	
	@keyframes modalFadeIn {
		from {
			background: rgba(0, 0, 0, 0);
			backdrop-filter: blur(0px);
		}
		to {
			background: rgba(0, 0, 0, 0.9);
			backdrop-filter: blur(8px);
		}
	}
	
	@keyframes modalFadeOut {
		from {
			background: rgba(0, 0, 0, 0.9);
			backdrop-filter: blur(8px);
		}
		to {
			background: rgba(0, 0, 0, 0);
			backdrop-filter: blur(0px);
		}
	}
	
	.modal-content {
		position: relative;
		max-width: 95vw;
		max-height: 95vh;
		background: rgba(17, 24, 39, 0);
		backdrop-filter: blur(0px);
		border: 1px solid rgba(255, 255, 255, 0);
		border-radius: 1.5rem;
		padding: 1rem;
		box-shadow: 
			0 25px 50px -12px rgba(0, 0, 0, 0),
			0 4px 6px -1px rgba(0, 0, 0, 0),
			0 2px 4px -1px rgba(0, 0, 0, 0),
			inset 0 1px 0 0 rgba(255, 255, 255, 0);
		transform: scale(0.8);
		opacity: 0;
		animation: contentSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards;
	}
	
	.modal-content.closing {
		animation: contentSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}
	
	@keyframes contentSlideIn {
		to {
			background: rgba(17, 24, 39, 0.3);
			backdrop-filter: blur(20px);
			border-color: rgba(255, 255, 255, 0.1);
			box-shadow: 
				0 25px 50px -12px rgba(0, 0, 0, 0.25),
				0 4px 6px -1px rgba(0, 0, 0, 0.1),
				0 2px 4px -1px rgba(0, 0, 0, 0.06),
				inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
			transform: scale(1);
			opacity: 1;
		}
	}
	
	@keyframes contentSlideOut {
		from {
			background: rgba(17, 24, 39, 0.3);
			backdrop-filter: blur(20px);
			border-color: rgba(255, 255, 255, 0.1);
			box-shadow: 
				0 25px 50px -12px rgba(0, 0, 0, 0.25),
				0 4px 6px -1px rgba(0, 0, 0, 0.1),
				0 2px 4px -1px rgba(0, 0, 0, 0.06),
				inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
			transform: scale(1);
			opacity: 1;
		}
		to {
			background: rgba(17, 24, 39, 0);
			backdrop-filter: blur(0px);
			border-color: rgba(255, 255, 255, 0);
			box-shadow: 
				0 25px 50px -12px rgba(0, 0, 0, 0),
				0 4px 6px -1px rgba(0, 0, 0, 0),
				0 2px 4px -1px rgba(0, 0, 0, 0),
				inset 0 1px 0 0 rgba(255, 255, 255, 0);
			transform: scale(0.8);
			opacity: 0;
		}
	}
	
	.close-btn {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 0.75rem;
		color: white;
		padding: 0.5rem;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 10;
		box-shadow: 
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06);
		opacity: 0;
		transform: scale(0.8);
		animation: buttonFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
	}
	
	.close-btn:hover {
		background: rgba(255, 255, 255, 0.2);
		border-color: rgba(255, 255, 255, 0.3);
		transform: scale(1.1);
	}
	
	@keyframes buttonFadeIn {
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	
	.expanded-image {
		max-width: 100%;
		max-height: calc(95vh - 4rem);
		border-radius: 1rem;
		display: block;
		margin: 0 auto;
		opacity: 0;
		transform: scale(0.9);
		animation: imageFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
	}
	
	@keyframes imageFadeIn {
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	
	@media (max-width: 768px) {
		.image-modal {
			padding: 1rem;
		}
		
		.modal-content {
			padding: 0.5rem;
		}
		
		.expanded-image {
			max-height: calc(95vh - 2rem);
		}
	}
</style>
