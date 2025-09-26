export function initAnchorLinks() {
	if (typeof window === 'undefined') return;

	// Function to create a URL-friendly slug from text
	function createSlug(text) {
		return text
			.toLowerCase()
			.replace(/[^\w\s-]/g, '') // Remove special characters
			.replace(/\s+/g, '-') // Replace spaces with hyphens
			.replace(/-+/g, '-') // Replace multiple hyphens with single
			.replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
			.trim();
	}

	// Function to detect device type
	function isTouchDevice() {
		return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
	}

	// Function to add anchor links to headings
	function addAnchorLinks() {
		const headings = document.querySelectorAll('.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6');
		
		headings.forEach(heading => {
			// Skip if already processed
			if (heading.querySelector('.anchor-link')) return;
			
			const text = heading.textContent.trim();
			const slug = createSlug(text);
			
			// Ensure unique ID
			let finalSlug = slug;
			let counter = 1;
			while (document.getElementById(finalSlug)) {
				finalSlug = `${slug}-${counter}`;
				counter++;
			}
			
			// Set the id for the heading
			heading.id = finalSlug;
			
			// Create anchor link
			const anchorLink = document.createElement('a');
			anchorLink.href = `#${finalSlug}`;
			anchorLink.className = 'anchor-link';
			anchorLink.setAttribute('aria-label', `Copy link to ${text}`);
			anchorLink.innerHTML = `
				<svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
					<path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"></path>
				</svg>
			`;
			anchorLink.title = 'Copy link to this section';
			
			// Add click handler to copy link to clipboard
			anchorLink.addEventListener('click', async (e) => {
				e.preventDefault();
				
				const url = `${window.location.origin}${window.location.pathname}#${finalSlug}`;
				
				try {
					// Use modern clipboard API with fallback
					if (navigator.clipboard && window.isSecureContext) {
						await navigator.clipboard.writeText(url);
					} else {
						// Fallback for older browsers or non-secure contexts
						const textArea = document.createElement('textarea');
						textArea.value = url;
						textArea.style.position = 'fixed';
						textArea.style.left = '-999999px';
						textArea.style.top = '-999999px';
						document.body.appendChild(textArea);
						textArea.focus();
						textArea.select();
						document.execCommand('copy');
						document.body.removeChild(textArea);
					}
					
					// Visual feedback - show checkmark
					const originalHTML = anchorLink.innerHTML;
					anchorLink.innerHTML = `
						<svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
						</svg>
					`;
					anchorLink.style.color = 'rgba(34, 197, 94, 0.9)';
					anchorLink.setAttribute('aria-label', 'Link copied!');
					
					setTimeout(() => {
						anchorLink.innerHTML = originalHTML;
						anchorLink.style.color = '';
						anchorLink.setAttribute('aria-label', `Copy link to ${text}`);
					}, 2000);
				} catch (err) {
					console.error('Failed to copy link:', err);
					// Fallback: show the URL in a more user-friendly way
					if (confirm(`Copy this link to clipboard?\n\n${url}`)) {
						// Try the fallback method
						try {
							const textArea = document.createElement('textarea');
							textArea.value = url;
							document.body.appendChild(textArea);
							textArea.select();
							document.execCommand('copy');
							document.body.removeChild(textArea);
							alert('Link copied to clipboard!');
						} catch (fallbackErr) {
							alert(`Please copy this link manually:\n\n${url}`);
						}
					}
				}
			});
			
			// Insert anchor link
			heading.appendChild(anchorLink);
			
			// Make the heading text clickable for copying the link
			const headingText = heading.childNodes[0]; // Get the text node
			if (headingText && headingText.nodeType === Node.TEXT_NODE) {
				const textSpan = document.createElement('span');
				textSpan.textContent = headingText.textContent;
				textSpan.style.cursor = 'pointer';
				textSpan.title = 'Click to copy link to this section';
				
				// Replace the text node with the clickable span
				heading.replaceChild(textSpan, headingText);
				
				textSpan.addEventListener('click', async (e) => {
					// Don't trigger if clicking on the anchor link itself
					if (e.target.closest('.anchor-link')) return;
					
					e.preventDefault();
					
					const url = `${window.location.origin}${window.location.pathname}#${finalSlug}`;
					
					try {
						// Use modern clipboard API with fallback
						if (navigator.clipboard && window.isSecureContext) {
							await navigator.clipboard.writeText(url);
						} else {
							// Fallback for older browsers or non-secure contexts
							const textArea = document.createElement('textarea');
							textArea.value = url;
							textArea.style.position = 'fixed';
							textArea.style.left = '-999999px';
							textArea.style.top = '-999999px';
							document.body.appendChild(textArea);
							textArea.focus();
							textArea.select();
							document.execCommand('copy');
							document.body.removeChild(textArea);
						}
						
						// Visual feedback - show checkmark on anchor link
						const originalHTML = anchorLink.innerHTML;
						anchorLink.innerHTML = `
							<svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
							</svg>
						`;
						anchorLink.style.color = 'rgba(34, 197, 94, 0.9)';
						anchorLink.setAttribute('aria-label', 'Link copied!');
						
						setTimeout(() => {
							anchorLink.innerHTML = originalHTML;
							anchorLink.style.color = '';
							anchorLink.setAttribute('aria-label', `Copy link to ${text}`);
						}, 2000);
					} catch (err) {
						console.error('Failed to copy link:', err);
						// Fallback: show the URL in a more user-friendly way
						if (confirm(`Copy this link to clipboard?\n\n${url}`)) {
							// Try the fallback method
							try {
								const textArea = document.createElement('textarea');
								textArea.value = url;
								document.body.appendChild(textArea);
								textArea.select();
								document.execCommand('copy');
								document.body.removeChild(textArea);
								alert('Link copied to clipboard!');
							} catch (fallbackErr) {
								alert(`Please copy this link manually:\n\n${url}`);
							}
						}
					}
				});
			}
		});
	}

	// Initialize on page load
	addAnchorLinks();

	// Re-initialize when content changes (for dynamic content)
	const observer = new MutationObserver((mutations) => {
		let shouldReinit = false;
		mutations.forEach((mutation) => {
			if (mutation.type === 'childList') {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						if (node.matches && node.matches('.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6')) {
							shouldReinit = true;
						} else if (node.querySelector && node.querySelector('.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6')) {
							shouldReinit = true;
						}
					}
				});
			}
		});
		
		if (shouldReinit) {
			addAnchorLinks();
		}
	});

	// Start observing
	observer.observe(document.body, {
		childList: true,
		subtree: true
	});

	// Handle URL hash navigation with better device support
	function handleHashNavigation() {
		const hash = window.location.hash;
		if (hash) {
			const element = document.querySelector(hash);
			if (element) {
				// Use requestAnimationFrame for better performance
				requestAnimationFrame(() => {
					element.scrollIntoView({ 
						behavior: 'smooth',
						block: 'start',
						inline: 'nearest'
					});
				});
			}
		}
	}

	// Handle initial hash
	handleHashNavigation();

	// Handle hash changes
	window.addEventListener('hashchange', handleHashNavigation);

	// Handle browser back/forward navigation
	window.addEventListener('popstate', handleHashNavigation);

	// Cleanup function
	return function cleanup() {
		observer.disconnect();
		window.removeEventListener('hashchange', handleHashNavigation);
		window.removeEventListener('popstate', handleHashNavigation);
	};
}
