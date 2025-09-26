import { browser } from '$app/environment';
import { dev } from '$app/environment';

export async function registerServiceWorker() {
	if (!browser || dev) return;

	if ('serviceWorker' in navigator) {
		try {
			const registration = await navigator.serviceWorker.register('/service-worker.js', {
				scope: '/'
			});

			console.log('Service Worker registered:', registration);

			// Handle updates
			registration.addEventListener('updatefound', () => {
				const newWorker = registration.installing;
				if (newWorker) {
					newWorker.addEventListener('statechange', () => {
						if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
							// New content is available, reload the page
							window.location.reload();
						}
					});
				}
			});

			// Handle controller change
			navigator.serviceWorker.addEventListener('controllerchange', () => {
				window.location.reload();
			});

		} catch (error) {
			console.error('Service Worker registration failed:', error);
		}
	}
}

export async function unregisterServiceWorker() {
	if (!browser) return;

	if ('serviceWorker' in navigator) {
		try {
			const registrations = await navigator.serviceWorker.getRegistrations();
			await Promise.all(registrations.map(registration => registration.unregister()));
			console.log('Service Workers unregistered');
		} catch (error) {
			console.error('Service Worker unregistration failed:', error);
		}
	}
}
