const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');
const typography = require('@tailwindcss/typography');

/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['"Inter"', ...defaultTheme.fontFamily.sans]
			},
			colors: {
				primary: {
					100: "hsl(var(--primary-100) / <alpha-value>)",
					200: "hsl(var(--primary-200) / <alpha-value>)",
					300: "hsl(var(--primary-300) / <alpha-value>)",
					400: "hsl(var(--primary-400) / <alpha-value>)",
					500: "hsl(var(--primary-500) / <alpha-value>)",
					600: "hsl(var(--primary-600) / <alpha-value>)",
					700: "hsl(var(--primary-700) / <alpha-value>)",
					800: "hsl(var(--primary-800) / <alpha-value>)",
					900: "hsl(var(--primary-900) / <alpha-value>)",
				},
			},
			animation: {
				cursor: "cursor 6s linear infinite",
			},
			keyframes: {
				cursor: {
					"0%": {
						transform: "rotate(0deg)",
					},
					"100%": {
						transform: "rotate(360deg)",
					},
				},
			},
		}
	},

	plugins: [
		typography,
		plugin(({ addVariant }) => {
			addVariant('hf', ['&:hover', '&:focus']);
			addVariant('hv', ['&:hover', '&:focus-visible']);
			addVariant('group-hf', ['.group:hover &', '.group:focus &']);
			addVariant('group-hv', [
				'.group:hover &',
				'.group:focus-visible &'
			]);
		})
	]
};

module.exports = config;
