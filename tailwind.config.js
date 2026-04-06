/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                display: ['"Syne"', 'sans-serif'],
                body: ['"DM Sans"', 'sans-serif'],
                mono: ['"DM Mono"', 'monospace'],
            },
            colors: {
                bg: '#0a0a0f',
                surface: '#111118',
                card: '#16161f',
                border: '#1e1e2e',
                accent: '#7c6af7',
                'accent-dim': '#5b4fd4',
                emerald: '#10b981',
                rose: '#f43f5e',
                amber: '#f59e0b',
                muted: '#4a4a6a',
                subtle: '#2a2a3e',
                text: '#e8e8f0',
                'text-muted': '#8888aa',
            },
            animation: {
                'fade-up': 'fadeUp 0.5s ease forwards',
                'fade-in': 'fadeIn 0.4s ease forwards',
                'pulse-slow': 'pulse 3s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: 0, transform: 'translateY(16px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
        },
    },
    plugins: [],
}