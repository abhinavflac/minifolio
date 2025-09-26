import { build, files, version } from '$service-worker';

const CACHE_NAME = `portfolio-cache-${version}`;
const STATIC_CACHE = 'static-cache';
const DYNAMIC_CACHE = 'dynamic-cache';

// Files to cache immediately
const STATIC_FILES = [
	...files,
	...build,
	'/',
	'/projects',
	'/music'
];

// API endpoints to cache
const API_ENDPOINTS = [
	'/api/now-playing',
	'/api/top-tracks', 
	'/api/weather'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
	console.log('Service Worker installing...');
	
	event.waitUntil(
		caches.open(STATIC_CACHE)
			.then(cache => {
				console.log('Caching static files...');
				return cache.addAll(STATIC_FILES);
			})
			.then(() => {
				console.log('Static files cached successfully');
				return self.skipWaiting();
			})
			.catch(error => {
				console.error('Failed to cache static files:', error);
			})
	);
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
	console.log('Service Worker activating...');
	
	event.waitUntil(
		caches.keys()
			.then(cacheNames => {
				return Promise.all(
					cacheNames.map(cacheName => {
						if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
							console.log('Deleting old cache:', cacheName);
							return caches.delete(cacheName);
						}
					})
				);
			})
			.then(() => {
				console.log('Service Worker activated');
				return self.clients.claim();
			})
	);
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip non-GET requests
	if (request.method !== 'GET') return;

	// Skip chrome-extension and other non-http requests
	if (!url.protocol.startsWith('http')) return;

	event.respondWith(handleRequest(request));
});

async function handleRequest(request: Request): Promise<Response> {
	const url = new URL(request.url);
	
	try {
		// Strategy 1: Cache First for static assets
		if (isStaticAsset(url)) {
			return await cacheFirst(request);
		}
		
		// Strategy 2: Network First for API calls
		if (isAPIRequest(url)) {
			return await networkFirst(request);
		}
		
		// Strategy 3: Stale While Revalidate for pages
		if (isPageRequest(url)) {
			return await staleWhileRevalidate(request);
		}
		
		// Default: Network First
		return await networkFirst(request);
		
	} catch (error) {
		console.error('Fetch failed:', error);
		
		// Return offline page for navigation requests
		if (isPageRequest(url)) {
			const offlineResponse = await caches.match('/offline.html');
			if (offlineResponse) {
				return offlineResponse;
			}
		}
		
		throw error;
	}
}

// Cache First Strategy - for static assets
async function cacheFirst(request: Request): Promise<Response> {
	const cache = await caches.open(STATIC_CACHE);
	const cached = await cache.match(request);
	
	if (cached) {
		return cached;
	}
	
	const response = await fetch(request);
	if (response.ok) {
		cache.put(request, response.clone());
	}
	
	return response;
}

// Network First Strategy - for API calls
async function networkFirst(request: Request): Promise<Response> {
	const cache = await caches.open(DYNAMIC_CACHE);
	
	try {
		const response = await fetch(request);
		if (response.ok) {
			cache.put(request, response.clone());
		}
		return response;
	} catch (error) {
		const cached = await cache.match(request);
		if (cached) {
			return cached;
		}
		throw error;
	}
}

// Stale While Revalidate Strategy - for pages
async function staleWhileRevalidate(request: Request): Promise<Response> {
	const cache = await caches.open(DYNAMIC_CACHE);
	const cached = await cache.match(request);
	
	// Return cached version immediately
	if (cached) {
		// Update cache in background
		fetch(request)
			.then(response => {
				if (response.ok) {
					cache.put(request, response);
				}
			})
			.catch(() => {
				// Ignore background update failures
			});
		
		return cached;
	}
	
	// No cache, fetch from network
	const response = await fetch(request);
	if (response.ok) {
		cache.put(request, response.clone());
	}
	
	return response;
}

// Helper functions
function isStaticAsset(url: URL): boolean {
	return url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|ico)$/);
}

function isAPIRequest(url: URL): boolean {
	return url.pathname.startsWith('/api/');
}

function isPageRequest(url: URL): boolean {
	return url.pathname === '/' || 
		   url.pathname.startsWith('/projects') || 
		   url.pathname.startsWith('/music') ||
		   url.pathname.startsWith('/static/');
}

// Background sync for API calls
self.addEventListener('sync', (event) => {
	if (event.tag === 'api-sync') {
		event.waitUntil(syncAPIData());
	}
});

async function syncAPIData() {
	const cache = await caches.open(DYNAMIC_CACHE);
	
	for (const endpoint of API_ENDPOINTS) {
		try {
			const response = await fetch(endpoint);
			if (response.ok) {
				await cache.put(endpoint, response);
			}
		} catch (error) {
			console.warn(`Background sync failed for ${endpoint}:`, error);
		}
	}
}

// Message handling for cache management
self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
	
	if (event.data && event.data.type === 'CACHE_URLS') {
		const urls = event.data.urls;
		event.waitUntil(cacheUrls(urls));
	}
});

async function cacheUrls(urls: string[]) {
	const cache = await caches.open(DYNAMIC_CACHE);
	
	for (const url of urls) {
		try {
			const response = await fetch(url);
			if (response.ok) {
				await cache.put(url, response);
			}
		} catch (error) {
			console.warn(`Failed to cache ${url}:`, error);
		}
	}
}
