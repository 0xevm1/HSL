// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
// Import global styles or Tailwind entry point if needed
// import './assets/main.css' // Example if you have a CSS entry point
// If using Tailwind, ensure it's configured in postcss.config.js and included here or in index.html

// Create the Vue application instance
const app = createApp(App)

// Mount the application to the DOM element with id #app
app.mount('#app')
