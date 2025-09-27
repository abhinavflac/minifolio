import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { TopTracksResponse } from '$lib/types';

export const GET: RequestHandler = async ({ url }) => {
	const timeRange = url.searchParams.get('time_range') || 'medium_term';
	const limit = url.searchParams.get('limit') || '10';

	try {
		// This would typically fetch from Spotify API
		// For now, return mock data
		const mockTracks: TopTracksResponse = [
			{
				id: '1',
				name: 'Sample Track 1',
				artists: [{ id: '1', name: 'Sample Artist 1', type: 'artist' }],
				album: {
					id: '1',
					name: 'Sample Album',
					images: [{ url: 'https://via.placeholder.com/300', width: 300, height: 300 }],
					type: 'album'
				},
				duration_ms: 180000,
				popularity: 80,
				preview_url: null,
				type: 'track',
				uri: 'spotify:track:1'
			},
			{
				id: '2',
				name: 'Sample Track 2',
				artists: [{ id: '2', name: 'Sample Artist 2', type: 'artist' }],
				album: {
					id: '2',
					name: 'Sample Album 2',
					images: [{ url: 'https://via.placeholder.com/300', width: 300, height: 300 }],
					type: 'album'
				},
				duration_ms: 200000,
				popularity: 75,
				preview_url: null,
				type: 'track',
				uri: 'spotify:track:2'
			}
		] as any;

		return json(mockTracks);
	} catch (error) {
		console.error('Top tracks API error:', error);
		return json({ error: 'Failed to fetch top tracks' }, { status: 500 });
	}
};
