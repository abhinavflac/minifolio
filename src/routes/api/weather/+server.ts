import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

export async function GET({ url, fetch, setHeaders }) {
	const lat = url.searchParams.get('lat');
	const lon = url.searchParams.get('lon');
	
	// Default to Shimla, India if no coordinates provided
	const defaultLat = 31.1048;
	const defaultLon = 77.1734;
	
	const weatherLat = lat ? parseFloat(lat) : defaultLat;
	const weatherLon = lon ? parseFloat(lon) : defaultLon;
	
	const data = await fetch(
		`https://api.openweathermap.org/data/2.5/weather?lat=${weatherLat}&lon=${weatherLon}&units=metric&appid=${env.WEATHER_API_KEY}`
	).then(res => res.json());

	setHeaders({
		'Cache-Control': 'public, max-age=0, s-maxage=300'
	});

	return json(data);
}
