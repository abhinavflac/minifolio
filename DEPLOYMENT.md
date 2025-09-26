# Portfolio Website

A modern portfolio website built with SvelteKit, featuring real-time integrations with Spotify, Discord, and weather data.

## Features

- 🎵 **Spotify Integration** - Live now playing and top tracks
- 🎮 **Discord Status** - Real-time Discord presence
- 🌤️ **Weather Widget** - Location-based weather with auto-detection
- 📱 **Responsive Design** - Mobile-first with adaptive layouts
- 🌙 **Dark Mode** - Automatic theme switching
- ⚡ **Fast Performance** - Built with SvelteKit and optimized for speed

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your API keys
4. Run development server: `npm run dev`

## Deployment to Vercel

### Method 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect it's a SvelteKit project
6. Add your environment variables in the Vercel dashboard
7. Deploy!

### Environment Variables

Set these in your Vercel project settings:

```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret  
SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token
WEATHER_API_KEY=your_openweather_api_key
DISCORD_USER_ID=your_discord_user_id
```

### Getting API Keys

**Spotify:**
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Get Client ID and Client Secret
4. Use Spotify's authorization flow to get refresh token

**OpenWeatherMap:**
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key

**Discord:**
1. Enable Developer Mode in Discord
2. Right-click your profile → Copy User ID

## Tech Stack

- **Framework:** SvelteKit
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **APIs:** Spotify Web API, OpenWeatherMap, Discord (via Lanyard)

## Project Structure

```
src/
├── routes/
│   ├── (home)/          # Home page components
│   ├── music/           # Music page
│   ├── projects/        # Projects showcase
│   └── api/             # API endpoints
├── lib/
│   ├── components/      # Reusable components
│   └── server/          # Server utilities
└── static/              # Static assets
```

This project is fully optimized for Vercel deployment with automatic builds and deployments on every push to main branch.