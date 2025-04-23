/** @type {import('tailwindcss').Config} */

// Import the Config type for TypeScript support (optional but recommended)
import type { Config } from 'tailwindcss';

const config: Config = {
  // Configure paths to all of your template files
  content: [
    "./index.html", // Include the main HTML file
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Include all Vue, JS, TS files in the src directory
    // Add any other paths where you might use Tailwind classes
  ],
  theme: {
    // Extend the default theme here if needed
    extend: {
      // Example: Add custom fonts or colors
      // fontFamily: {
      //   sans: ['Inter', 'sans-serif'],
      // },
    },
  },
  // Add any Tailwind plugins here
  plugins: [
     // Example: require('@tailwindcss/forms'),
  ],
}

export default config;
