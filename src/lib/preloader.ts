import { browser } from '$app/environment';

export interface PreloadProgress {
	progress: number;
	message: string;
	stage: string;
}

export class AppPreloader {
	private callbacks: ((progress: PreloadProgress) => void)[] = [];
	private preloadedRoutes = new Set<string>();
	private preloadedData = new Map<string, any>();

	constructor() {
		if (browser) {
			this.initializePreloading();
		}
	}

	subscribe(callback: (progress: PreloadProgress) => void) {
		this.callbacks.push(callback);
		return () => {
			const index = this.callbacks.indexOf(callback);
			if (index > -1) this.callbacks.splice(index, 1);
		};
	}

	private updateProgress(progress: number, message: string, stage: string) {
		this.callbacks.forEach(callback => {
			callback({ progress, message, stage });
		});
	}

	private async initializePreloading() {
		// Stage 1: Initialization
		this.updateProgress(10, 'Initializing...', 'init');
		await new Promise(resolve => setTimeout(resolve, 200));
		
		// Stage 2: Loading components
		this.updateProgress(25, 'Loading components...', 'components');
		await new Promise(resolve => setTimeout(resolve, 300));
		
		// Stage 3: Preparing routes
		this.updateProgress(40, 'Preparing routes...', 'routes');
		await new Promise(resolve => setTimeout(resolve, 200));
		
		// Stage 4: Loading APIs (NEW!)
		this.updateProgress(50, 'Loading weather data...', 'weather');
		await this.preloadWeatherAPI();
		
		this.updateProgress(65, 'Loading Spotify data...', 'spotify');
		await this.preloadSpotifyAPI();
		
		this.updateProgress(80, 'Loading Discord data...', 'discord');
		await this.preloadDiscordAPI();
		
		// Stage 5: Optimizing performance
		this.updateProgress(90, 'Optimizing performance...', 'optimize');
		await new Promise(resolve => setTimeout(resolve, 200));
		
		// Stage 6: Finalizing
		this.updateProgress(95, 'Finalizing...', 'finalize');
		await new Promise(resolve => setTimeout(resolve, 200));
		
		this.updateProgress(100, 'Ready!', 'complete');
		await new Promise(resolve => setTimeout(resolve, 500));
	}

	// API Preloading Methods
	private async preloadWeatherAPI() {
		try {
			const response = await fetch('/api/weather');
			if (response.ok) {
				const data = await response.json();
				this.preloadedData.set('weather', data);
				console.log('✅ Weather API preloaded:', data);
			}
		} catch (error) {
			console.warn('⚠️ Weather API preload failed:', error);
		}
	}

	private async preloadSpotifyAPI() {
		try {
			const response = await fetch('/api/now-playing');
			if (response.ok) {
				const data = await response.json();
				this.preloadedData.set('spotify', data);
				console.log('✅ Spotify API preloaded:', data);
			}
		} catch (error) {
			console.warn('⚠️ Spotify API preload failed:', error);
		}
	}

	private async preloadDiscordAPI() {
		try {
			// Discord data comes from sk-lanyard, so we'll simulate it
			// In a real implementation, you'd fetch from your Discord API
			const discordData = {
				discord_status: 'online',
				discord_user: {
					username: 'Abhinav',
					discriminator: '0001'
				},
				activities: []
			};
			this.preloadedData.set('discord', discordData);
			console.log('✅ Discord API preloaded:', discordData);
		} catch (error) {
			console.warn('⚠️ Discord API preload failed:', error);
		}
	}

	// Public methods for accessing preloaded data
	getPreloadedData(key: string) {
		return this.preloadedData.get(key);
	}

	isRoutePreloaded(route: string) {
		return this.preloadedRoutes.has(route);
	}

	// Method to prefetch additional routes on hover
	async prefetchRoute(route: string) {
		if (!this.preloadedRoutes.has(route)) {
			try {
				// Simple route prefetching - just mark as preloaded
				this.preloadedRoutes.add(route);
			} catch (error) {
				console.warn(`Failed to prefetch route ${route}:`, error);
			}
		}
	}
}

// Global preloader instance
export const appPreloader = new AppPreloader();