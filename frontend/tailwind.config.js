// ifqe-portal-frontend5/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Colors
        background: '#F8F9FA',      // Off-White
        foreground: '#212529',      // Dark Charcoal for text
        
        // Card Colors (FIX: Added this section)
        card: '#FFFFFF',            // Solid White for cards and modals
        'card-foreground': '#212529',

        // Primary (Blue)
        primary: {
          DEFAULT: '#0A4D8C',       // Deep Cerulean Blue
          foreground: '#FFFFFF',    // White text for primary buttons
        },

        // Secondary / Muted
        secondary: {
          DEFAULT: '#E9ECEF',       // Light secondary background
          foreground: '#495057',    // Darker text for secondary elements
        },
        muted: {
          DEFAULT: '#DEE2E6',       // Light Gray for borders
          foreground: '#6C757D',    // Muted gray for secondary text
        },

        // Accent / Destructive (Red)
        destructive: {
          DEFAULT: '#D90429',       // Vibrant Crimson
          foreground: '#FFFFFF',
        },

        // Other utility colors
        accent: {
          DEFAULT: '#F8F9FA',
          foreground: '#212529',
        },
        ring: '#0A4D8C', // For focus rings
        border: '#DEE2E6',
        input: '#DEE2E6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: `0.5rem`,
        md: `calc(0.5rem - 2px)`,
        sm: `calc(0.5rem - 4px)`,
      },
    },
  },
  plugins: [],
}