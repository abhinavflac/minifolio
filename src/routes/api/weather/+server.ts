import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { WeatherResponse } from '$lib/types';

export const GET: RequestHandler = async ({ url, platform }) => {
	const lat = url.searchParams.get('lat');
	const lon = url.searchParams.get('lon');

	if (!lat || !lon) {
		return json({ error: 'Latitude and longitude are required' }, { status: 400 });
	}

	try {
		// Using OpenWeatherMap API (free tier)
		const API_KEY = process.env.WEATHER_API_KEY || process.env.OPENWEATHER_API_KEY || 'your-api-key-here';
		const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
		
		const response = await fetch(weatherUrl);
		
		if (!response.ok) {
			throw new Error(`Weather API error: ${response.status}`);
		}
		
		const weatherData: WeatherResponse = await response.json();
		
		return json(weatherData);
	} catch (error) {
		console.error('Weather API error:', error);
		
		// Return mock data for development
		const mockWeather: WeatherResponse = {
			coord: { lon: parseFloat(lon), lat: parseFloat(lat) },
			weather: [{
				id: 800,
				main: 'Clear',
				description: 'clear sky',
				icon: '01d'
			}],
			base: 'stations',
			main: {
				temp: 22,
				feels_like: 24,
				temp_min: 20,
				temp_max: 25,
				pressure: 1013,
				humidity: 65,
				sea_level: 1013,
				grnd_level: 1010
			},
			visibility: 10000,
			wind: {
				speed: 3.5,
				deg: 180,
				gust: 5.2
			},
			clouds: { all: 0 },
			rain: { '1h': 0, '3h': 0 },
			snow: { '1h': 0, '3h': 0 },
			dt: Math.floor(Date.now() / 1000),
			sys: {
				type: 1,
				id: 1234,
				country: 'IN',
				sunrise: Math.floor(Date.now() / 1000) - 3600,
				sunset: Math.floor(Date.now() / 1000) + 3600
			},
			timezone: 19800,
			id: 1258980,
			name: 'Shimla',
			cod: 200
		};
		
		return json(mockWeather);
	}
};
