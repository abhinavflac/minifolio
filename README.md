# Abhinav's Advanced Portfolio Website

A cutting-edge, feature-rich personal portfolio website showcasing AI & Data Science expertise, built with SvelteKit and featuring real-time integrations, custom animations, and modern web technologies.

## 🎯 Project Overview

This portfolio represents a comprehensive showcase of modern web development techniques, combining aesthetic design with powerful functionality. The project demonstrates expertise in full-stack development, API integrations, responsive design, and performance optimization while maintaining a focus on user experience and accessibility.

### 🌟 Key Highlights

- **Real-time Data Integration**: Live Spotify music tracking, Discord presence status, and location-based weather information
- **Advanced UI/UX**: Custom cursor animations, smooth page transitions, and responsive design patterns
- **Performance Optimized**: Built with SvelteKit for optimal loading speeds and SEO
- **Modern Architecture**: TypeScript, component-based architecture, and API-first design
- **Professional Deployment**: Configured for Vercel with automatic CI/CD pipeline

## 🛠️ Technical Stack & Architecture

### Frontend Framework & Language
- **SvelteKit** (v2.5.28): Modern meta-framework for building reactive web applications
- **TypeScript** (v5.4.2): Strongly typed JavaScript for better development experience
- **Vite** (v5.4.8): Next-generation frontend build tool for fast development

### Styling & Design
- **TailwindCSS** (v3.4.1): Utility-first CSS framework for rapid UI development
- **PostCSS** (v8.4.36): CSS preprocessor for advanced styling capabilities
- **Custom CSS**: Hand-crafted animations and transitions
- **Inter Font Family**: Professional typography system

### API Integrations & Data Sources
- **Spotify Web API SDK** (@spotify/web-api-ts-sdk): Real-time music data and user statistics
- **Discord Lanyard** (sk-lanyard): Live Discord presence and activity status
- **OpenWeatherMap API**: Location-based weather information with auto-detection
- **IP Geolocation**: Automatic user location detection for personalized experience

### Development & Build Tools
- **ESLint**: Code linting and quality assurance
- **Prettier**: Code formatting and consistency
- **Autoprefixer**: Automatic CSS vendor prefixing
- **Svelte Check**: TypeScript checking for Svelte components

### Deployment & Hosting
- **Vercel**: Serverless deployment platform with global CDN
- **Vercel Adapter**: SvelteKit adapter optimized for Vercel's edge functions
- **Environment Variables**: Secure API key management

## 🏗️ Detailed Project Structure

```
minifolio/
├── 📁 .svelte-kit/               # SvelteKit generated files
│   ├── ambient.d.ts              # TypeScript ambient declarations
│   ├── generated/                # Auto-generated client/server code
│   ├── tsconfig.json            # Extended TypeScript configuration
│   └── types/                   # Generated type definitions
│
├── 📁 .vercel/                  # Vercel deployment configuration
│   └── output/                  # Build output for Vercel
│
├── 📁 src/                      # Source code directory
│   ├── 📄 app.d.ts             # Global app type definitions
│   ├── 📄 app.html             # Main HTML template
│   ├── 📄 app.postcss         # Global CSS styles and Tailwind imports
│   ├── 📄 fonts.postcss       # Custom font definitions and loading
│   │
│   ├── 📁 lib/                 # Shared library components and utilities
│   │   ├── 📁 components/      # Reusable UI components
│   │   │   ├── 📄 Cursor.svelte       # Custom cursor with animations
│   │   │   ├── 📄 Meta.svelte         # SEO meta tags component
│   │   │   └── 📁 icons/              # SVG icon components
│   │   │       ├── Cloud.svelte       # Weather cloud icon
│   │   │       ├── Discord.svelte     # Discord logo icon
│   │   │       ├── Envelope.svelte    # Email icon
│   │   │       ├── GitHub.svelte      # GitHub logo icon
│   │   │       ├── Linkedin.svelte    # LinkedIn logo icon
│   │   │       ├── Moon.svelte        # Night time icon
│   │   │       ├── MusicalNote.svelte # Music note icon
│   │   │       ├── Pause.svelte       # Music pause icon
│   │   │       ├── Play.svelte        # Music play icon
│   │   │       ├── Spotify.svelte     # Spotify logo icon
│   │   │       ├── Sun.svelte         # Day time icon
│   │   │       └── Twitter.svelte     # Twitter logo icon
│   │   │
│   │   ├── 📁 server/          # Server-side utilities and functions
│   │   │   └── 📄 spotify.ts   # Spotify API authentication and token management
│   │   │
│   │   ├── 📄 cursor.ts        # Custom cursor animation logic and mouse tracking
│   │   ├── 📄 stores.ts        # Svelte stores for global state management
│   │   └── 📄 types.ts         # TypeScript type definitions and interfaces
│   │
│   └── 📁 routes/              # SvelteKit routing system
│       ├── 📄 +error.svelte    # Global error handling component
│       ├── 📄 +layout.svelte   # Main application layout and navigation
│       ├── 📄 BackgroundEffect.svelte  # Animated background component
│       ├── 📄 NavLink.svelte   # Navigation link component with active states
│       │
│       ├── 📁 (home)/          # Home page route group
│       │   ├── 📄 +page.svelte         # Main landing page
│       │   ├── 📄 Clock.svelte         # Live clock with timezone switching
│       │   ├── 📄 DiscordInfo.svelte   # Discord status display
│       │   ├── 📄 MusicHistory.svelte  # Spotify top tracks component
│       │   ├── 📄 SocialLink.svelte    # Social media links component
│       │   ├── 📄 SpotifyInfo.svelte   # Currently playing music widget
│       │   └── 📄 Weather.svelte       # Weather widget with location detection
│       │
│       ├── 📁 api/             # API endpoints for external data
│       │   ├── 📁 now-playing/         # Spotify current song endpoint
│       │   │   └── 📄 +server.ts
│       │   ├── 📁 recent-tracks/       # Recent Spotify tracks endpoint
│       │   │   └── 📄 +server.ts
│       │   ├── 📁 top-tracks/          # Top Spotify tracks endpoint
│       │   │   └── 📄 +server.ts
│       │   └── 📁 weather/             # Weather data endpoint
│       │       └── 📄 +server.ts
│       │
│       ├── 📁 music/           # Music page route
│       │   └── 📄 +page.svelte         # Music statistics and history page
│       │
│       └── 📁 projects/        # Projects showcase route
│           ├── 📄 +page.svelte         # Projects listing page
│           └── 📄 Project.svelte       # Individual project component
│
├── 📁 static/                  # Static assets served directly
│   ├── 📄 favicon.png         # Website favicon
│   ├── 📁 fonts/              # Custom font files
│   │   ├── Inter-*.woff2      # Inter font family variants
│   │   └── InterDisplay-*.woff2  # Inter Display font variants
│   └── 📁 images/             # Image assets
│       └── 📁 projects/       # Project screenshots and images
│           ├── hydrochemical.png  # Alaska Water Analysis project image
│           └── stagefit.png       # StageFit project image
│
├── 📄 .env                    # Environment variables (not in version control)
├── 📄 .env.example           # Environment variables template
├── 📄 .eslintignore          # ESLint ignore patterns
├── 📄 .eslintrc.cjs          # ESLint configuration
├── 📄 .gitignore             # Git ignore patterns
├── 📄 .node-version          # Node.js version specification
├── 📄 .npmrc                 # NPM configuration
├── 📄 .prettierignore        # Prettier ignore patterns
├── 📄 .prettierrc            # Prettier configuration
├── 📄 DEPLOYMENT.md          # Detailed deployment instructions
├── 📄 LICENSE                # GPL-3.0 license
├── 📄 package.json           # Project dependencies and scripts
├── 📄 package-lock.json      # Locked dependency versions
├── 📄 postcss.config.cjs     # PostCSS configuration
├── 📄 README.md              # This comprehensive documentation
├── 📄 svelte.config.js       # SvelteKit configuration
├── 📄 tailwind.config.cjs    # TailwindCSS configuration
├── 📄 tsconfig.json          # TypeScript configuration
├── 📄 vercel.json            # Vercel deployment configuration
└── 📄 vite.config.ts         # Vite build tool configuration
```

## 🚀 Getting Started - Complete Setup Guide

### Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** package manager
- **Git** for version control - [Download here](https://git-scm.com/)
- A code editor like **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)

### Step 1: Project Installation

```bash
# Clone the repository
git clone https://github.com/GithubMaster-IN/minifolio.git

# Navigate to project directory
cd minifolio

# Install all dependencies
npm install

# Or if you prefer yarn
yarn install
```

### Step 2: Environment Configuration

The project requires several API keys for full functionality. Create environment variables:

```bash
# Copy the example environment file
cp .env.example .env
```

Edit the `.env` file with your API credentials:

```env
# Spotify Web API Configuration
# Get these from: https://developer.spotify.com/dashboard/applications
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token_here

# OpenWeatherMap API Configuration
# Get free API key from: https://openweathermap.org/api
WEATHER_API_KEY=your_openweathermap_api_key_here

# Discord User ID (Optional)
# Your Discord user ID for Lanyard integration
DISCORD_USER_ID=your_discord_user_id_here
```

### Step 3: Obtaining API Keys

#### Spotify API Setup (Detailed)

1. **Create Spotify Developer Account**:
   - Visit [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
   - Log in with your Spotify account
   - Accept the Terms of Service

2. **Create New Application**:
   - Click "Create App"
   - Fill in application details:
     - App Name: "Personal Portfolio"
     - App Description: "Portfolio website music integration"
     - Website: Your portfolio URL
     - Redirect URI: `http://localhost:5173/callback` (for development)

3. **Get Client Credentials**:
   - Copy the Client ID and Client Secret from your app dashboard
   - Add these to your `.env` file

4. **Generate Refresh Token**:
   ```bash
   # Use Spotify's authorization flow to get refresh token
   # Visit: https://developer.spotify.com/documentation/general/guides/authorization/code-flow/
   ```

#### OpenWeatherMap API Setup

1. **Create Account**:
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account

2. **Generate API Key**:
   - Go to API Keys section in your account
   - Generate a new API key
   - Add it to your `.env` file

3. **API Limitations**:
   - Free tier: 1,000 calls/day
   - 60 calls/minute limit
   - Weather data updates every 10 minutes

### Step 4: Development Server

```bash
# Start the development server
npm run dev

# Or with yarn
yarn dev

# Server will start at http://localhost:5173
```

The development server includes:
- **Hot Module Replacement (HMR)**: Instant updates without page refresh
- **TypeScript Checking**: Real-time type checking
- **CSS Processing**: Automatic TailwindCSS compilation
- **API Proxy**: Local API endpoints for development

## 🎨 Features Deep Dive

### 1. Real-time Spotify Integration

The portfolio features sophisticated Spotify integration that displays:

#### Currently Playing Widget
- **Live Track Information**: Song title, artist, album
- **Playback Status**: Playing/paused state with visual indicators
- **Progress Tracking**: Real-time playback progress
- **Album Artwork**: High-quality cover images
- **Interactive Elements**: Click to open in Spotify

#### Music Statistics Page
- **Top Tracks**: Most played songs across different time periods
  - Last 4 weeks (short_term)
  - Last 6 months (medium_term)
  - All time (long_term)
- **Recently Played**: Latest listening history
- **Detailed Analytics**: Play counts, popularity scores
- **Visual Design**: Card-based layout with hover effects

#### Technical Implementation
```typescript
// API endpoint structure
/api/now-playing     // Current playback status
/api/top-tracks      // User's top tracks with time range
/api/recent-tracks   // Recently played tracks
```

### 2. Discord Presence Integration

Utilizes the Lanyard API to show real-time Discord status:

#### Status Indicators
- **Online Status**: Green indicator for active status
- **Idle Status**: Yellow indicator for away status
- **Do Not Disturb**: Red indicator for busy status
- **Offline Status**: Gray indicator when offline

#### Activity Display
- **Current Game/App**: What you're currently using
- **Custom Status**: Personal status messages
- **Listening Activity**: Spotify integration through Discord

### 3. Weather Widget with Geolocation

Advanced weather component with intelligent location detection:

#### Location Detection
- **IP-based Detection**: Automatic location from IP address
- **Fallback System**: Default to configured location if detection fails
- **Manual Toggle**: Switch between detected location and default city
- **Privacy Conscious**: No GPS permission required

#### Weather Information
- **Current Conditions**: Temperature, humidity, conditions
- **Weather Icons**: Dynamic icons based on conditions
- **Descriptive Text**: Human-readable weather descriptions
- **Location Display**: City name with loading states

### 4. Custom Cursor Animation System

Sophisticated cursor interaction system:

#### Cursor Behaviors
- **Smooth Following**: Laggy, organic movement animation
- **Hover States**: Different states for different elements
- **Link Detection**: Special animation when hovering links
- **Responsive Design**: Hidden on mobile devices
- **Performance Optimized**: RequestAnimationFrame for smooth animation

#### Technical Features
```typescript
// Cursor system features
- Mouse position tracking
- Element hover detection
- Smooth interpolation animation
- Dynamic styling based on context
- Automatic hide on inactivity
```

### 5. View Transitions & Page Animations

Modern page transition system:

#### Transition Effects
- **Page Transitions**: Smooth navigation between routes
- **Direction Detection**: Different animations based on navigation direction
- **Fade Animations**: Subtle content loading animations
- **Performance Optimized**: GPU-accelerated transitions

### 6. Responsive Design System

Comprehensive responsive design approach:

#### Breakpoint System
```css
/* Mobile First Approach */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X Extra large */
```

#### Adaptive Components
- **Navigation**: Hamburger menu on mobile
- **Grid Layouts**: Responsive grid systems
- **Typography**: Scalable text sizes
- **Images**: Responsive image loading
- **Touch Interactions**: Mobile-optimized interactions

## 🔧 Configuration Files Explained

### SvelteKit Configuration (`svelte.config.js`)
```javascript
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
    preprocess: [vitePreprocess()],
    kit: {
        adapter: adapter()  // Vercel deployment adapter
    }
};
```

### TypeScript Configuration (`tsconfig.json`)
```json
{
    "extends": "./.svelte-kit/tsconfig.json",
    "compilerOptions": {
        "allowJs": true,           // Allow JavaScript files
        "checkJs": true,           // Type-check JavaScript
        "esModuleInterop": true,   // ES module compatibility
        "strict": true,            // Strict type checking
        "moduleResolution": "bundler"  // Modern module resolution
    }
}
```

### TailwindCSS Configuration (`tailwind.config.cjs`)
```javascript
module.exports = {
    content: ['./src/**/*.{html,js,svelte,ts}'],  // Content scanning
    theme: {
        extend: {
            fontFamily: {
                'inter': ['Inter', 'sans-serif']  // Custom font family
            },
            animation: {
                'cursor': 'spin 8s linear infinite'  // Custom animations
            }
        }
    },
    plugins: []
};
```

### Vite Configuration (`vite.config.ts`)
```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [sveltekit()],
    // Additional Vite optimizations can be added here
});
```

## 📱 API Endpoints Documentation

### Spotify Endpoints

#### `/api/now-playing`
**Method**: GET  
**Description**: Retrieves current playback information  
**Response Format**:
```typescript
{
    isPlayingNow: boolean;
    isPaused: boolean;
    progessMs: number;
    track: SpotifyTrack | null;
}
```

#### `/api/top-tracks?time_range={period}`
**Method**: GET  
**Parameters**: 
- `time_range`: 'short_term' | 'medium_term' | 'long_term'  
**Description**: User's most played tracks  
**Response**: Array of Spotify track objects

#### `/api/recent-tracks?limit={number}`
**Method**: GET  
**Parameters**: 
- `limit`: Number of tracks (1-50)  
**Description**: Recently played tracks  
**Response**: Array of recent playback objects

### Weather Endpoint

#### `/api/weather?lat={latitude}&lon={longitude}`
**Method**: GET  
**Parameters**: 
- `lat`: Latitude coordinate (optional)
- `lon`: Longitude coordinate (optional)  
**Description**: Weather data for location  
**Default**: Falls back to Delhi, India if no coordinates provided  
**Response**: OpenWeatherMap API response object

## 🚀 Deployment Guide

### Vercel Deployment (Recommended)

#### Automatic Deployment
1. **Connect Repository**:
   - Push code to GitHub
   - Visit [Vercel Dashboard](https://vercel.com/dashboard)
   - Import GitHub repository
   - Vercel auto-detects SvelteKit

2. **Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env` file:
     ```
     SPOTIFY_CLIENT_ID
     SPOTIFY_CLIENT_SECRET
     SPOTIFY_REFRESH_TOKEN
     WEATHER_API_KEY
     ```

3. **Deploy**:
   - Automatic deployment on every push to main branch
   - Preview deployments for pull requests
   - Instant global CDN distribution

#### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

### Build Process Details

The build process involves several steps:

1. **TypeScript Compilation**: Convert TS to JS
2. **Svelte Compilation**: Transform Svelte components
3. **CSS Processing**: Compile TailwindCSS and PostCSS
4. **Asset Optimization**: Compress images and fonts
5. **Code Splitting**: Generate optimized bundles
6. **Server Generation**: Create server-side rendering functions

```bash
# Local build for testing
npm run build

# Preview production build
npm run preview
```

## 🧪 Development Workflow

### Code Quality Tools

#### ESLint Configuration
- **Rules**: Strict TypeScript and Svelte linting
- **Integration**: VS Code integration for real-time feedback
- **Auto-fix**: Automatic code correction on save

#### Prettier Configuration
- **Formatting**: Consistent code style across all files
- **Integration**: Format on save in VS Code
- **Svelte Support**: Proper Svelte component formatting

### Git Workflow
```bash
# Development workflow
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# Create pull request
# Merge to main triggers deployment
```

### Performance Monitoring

#### Lighthouse Scores
- **Performance**: 95+ score target
- **Accessibility**: 100 score maintained
- **Best Practices**: 100 score maintained
- **SEO**: 100 score with proper meta tags

#### Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## 🔐 Security & Privacy

### Environment Security
- **API Keys**: Never committed to version control
- **Server-side Processing**: Sensitive operations on server
- **CORS Protection**: Proper cross-origin request handling
- **Rate Limiting**: API request throttling

### Privacy Considerations
- **No Personal Data Storage**: No user data persistence
- **IP-based Location**: Optional, with fallback
- **Third-party APIs**: Only necessary integrations
- **Cookie-free**: No tracking or analytics cookies

## 🎯 Performance Optimizations

### Image Optimization
- **WebP Format**: Modern image format support
- **Lazy Loading**: Images load as needed
- **Responsive Images**: Multiple sizes for different screens
- **Compression**: Optimized file sizes

### Code Optimization
- **Tree Shaking**: Remove unused code
- **Code Splitting**: Load code as needed
- **Module Bundling**: Optimized bundle sizes
- **CSS Purging**: Remove unused CSS classes

### Caching Strategy
- **Static Assets**: Long-term caching for fonts/images
- **API Responses**: Appropriate cache headers
- **Build Assets**: Versioned for cache busting
- **CDN Distribution**: Global edge caching

## 🛠️ Troubleshooting Guide

### Common Issues

#### Module Resolution Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors
```bash
# Restart TypeScript server in VS Code
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

#### Build Failures
```bash
# Check for type errors
npm run build
# Fix any TypeScript issues before deployment
```

#### API Integration Issues
- **Check API Keys**: Ensure all environment variables are set
- **Rate Limits**: Monitor API quotas and limits
- **Network Issues**: Check API endpoint availability

### Development Tips
- **Hot Reload**: Save files to see instant changes
- **Browser DevTools**: Use for debugging API calls
- **Console Logging**: Add strategic logging for debugging
- **Error Boundaries**: Implement proper error handling

## 📊 Analytics & Monitoring

### Performance Tracking
- **Vercel Analytics**: Built-in performance monitoring
- **Lighthouse CI**: Automated performance testing
- **Web Vitals**: Core web vitals tracking

### Error Monitoring
- **Console Errors**: Monitor browser console
- **API Failures**: Handle and log API errors
- **Build Failures**: Monitor deployment status

## 🔮 Future Enhancements

### Planned Features
- **Blog Section**: Technical writing and tutorials
- **Contact Form**: Direct messaging capability
- **Theme Switching**: Light/dark mode toggle
- **Animation Controls**: Reduced motion preferences
- **Language Support**: Internationalization

### Technical Improvements
- **PWA Support**: Progressive Web App features
- **Offline Mode**: Cache for offline viewing
- **Performance**: Further optimization opportunities
- **Accessibility**: Enhanced screen reader support

---

## 📞 Support & Contact

### Technical Support
- **Issues**: Report bugs via GitHub Issues
- **Questions**: Email for technical questions
- **Contributions**: Follow contribution guidelines

### Contact Information
**Abhinav** - AI & Data Science Specialist  
📧 Email: [githubmasterin@gmail.com](mailto:githubmasterin@gmail.com)  
🐙 GitHub: [@GithubMaster-IN](https://github.com/GithubMaster-IN)  
💼 LinkedIn: [@GithubMaster](https://www.linkedin.com/in/GithubMaster)  
🐦 Twitter: [@GithubMasterIN](https://twitter.com/GithubMasterIN)

---

*This README was crafted with care to provide comprehensive documentation for every aspect of the portfolio project. It serves as both a guide for setup and a reference for understanding the technical implementation.*