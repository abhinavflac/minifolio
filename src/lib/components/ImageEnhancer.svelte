<script>
	import { onMount } from 'svelte';
	import ExpandableImage from './ExpandableImage.svelte';
	
	onMount(() => {
		// Find all images in the content and make them expandable
		const images = document.querySelectorAll('.prose img');
		
		images.forEach(img => {
			// Skip if already enhanced
			if (img.dataset.enhanced) return;
			
			// Create a wrapper div
			const wrapper = document.createElement('div');
			wrapper.style.position = 'relative';
			wrapper.style.display = 'inline-block';
			wrapper.style.cursor = 'pointer';
			
			// Insert wrapper before the image
			img.parentNode.insertBefore(wrapper, img);
			wrapper.appendChild(img);
			
			// Add click handler
			wrapper.addEventListener('click', () => {
				// Create and show modal
				showImageModal(img.src, img.alt || '');
			});
			
			// Mark as enhanced
			img.dataset.enhanced = 'true';
		});
	});
	
	function showImageModal(src, alt) {
		// Create modal element
		const modal = document.createElement('div');
		modal.className = 'image-modal';
		modal.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.9);
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 1000;
			padding: 2rem;
			cursor: pointer;
		`;
		
		// Create image
		const img = document.createElement('img');
		img.src = src;
		img.alt = alt;
		img.style.cssText = `
			max-width: 100%;
			max-height: 100%;
			border-radius: 1rem;
		`;
		
		// Create close button
		const closeBtn = document.createElement('button');
		closeBtn.innerHTML = '×';
		closeBtn.style.cssText = `
			position: absolute;
			top: 1rem;
			right: 1rem;
			background: rgba(255, 255, 255, 0.1);
			border: none;
			color: white;
			font-size: 2rem;
			width: 3rem;
			height: 3rem;
			border-radius: 50%;
			cursor: pointer;
			z-index: 1001;
		`;
		
		modal.appendChild(img);
		modal.appendChild(closeBtn);
		document.body.appendChild(modal);
		document.body.style.overflow = 'hidden';
		
		// Close handlers
		const close = () => {
			document.body.removeChild(modal);
			document.body.style.overflow = 'auto';
		};
		
		closeBtn.onclick = close;
		modal.onclick = close;
		
		// ESC key handler
		const handleKeydown = (e) => {
			if (e.key === 'Escape') {
				close();
				document.removeEventListener('keydown', handleKeydown);
			}
		};
		document.addEventListener('keydown', handleKeydown);
	}
</script>

<!-- This component just runs the enhancement script -->
