<template>
  <div id="app" class="container mx-auto p-4 font-sans">
    <header class="mb-6 text-center">
      <h1 class="text-3xl font-bold text-gray-800">HSL Color Swatch Grid</h1>
      <p class="text-gray-600">Select Saturation (S) and Lightness (L) to view named colors.</p>
    </header>

    <div class="controls bg-gray-100 p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
      <div class="control-group w-full sm:w-1/2">
        <label for="saturation" class="block text-sm font-medium text-gray-700 mb-1">
          Saturation (S): <span class="font-bold">{{ saturation }}%</span>
        </label>
        <input
          type="range"
          id="saturation"
          min="0"
          max="100"
          step="1"
          v-model.number="saturation"
          class="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          aria-label="Saturation slider"
        />
      </div>

      <div class="control-group w-full sm:w-1/2">
        <label for="lightness" class="block text-sm font-medium text-gray-700 mb-1">
          Lightness (L): <span class="font-bold">{{ lightness }}%</span>
        </label>
        <input
          type="range"
          id="lightness"
          min="0"
          max="100"
          step="1"
          v-model.number="lightness"
          class="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          aria-label="Lightness slider"
        />
      </div>
    </div>

    <main>
      <ColorSwatchGrid :saturation="saturation" :lightness="lightness" />
    </main>

     <footer class="mt-8 text-center text-gray-500 text-sm">
        Powered by <a href="https://www.thecolorapi.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">The Color API</a>
     </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ColorSwatchGrid from './components/ColorSwatchGrid.vue';

// --- State ---
// Initialize with default values (e.g., 100% Saturation, 50% Lightness as per example)
const saturation = ref<number>(100);
const lightness = ref<number>(50);

// --- Logic ---
// No complex logic needed in App.vue, state is managed by refs and passed as props.
// The ColorSwatchGrid component handles fetching based on these props.

</script>

<style>
/* Global styles or imports - Assuming Tailwind CSS is set up */
/* If not using Tailwind, add your own base styles here */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Example: Style the range input thumb */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  width: 20px; /* Set a specific slider handle width */
  height: 20px; /* Set a specific slider handle height */
  background: #4a90e2; /* Blue thumb color */
  border-radius: 50%; /* Circular thumb */
  cursor: pointer; /* Cursor on hover */
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #4a90e2;
  border-radius: 50%;
  cursor: pointer;
  border: none; /* Remove default border in Firefox */
}

/* Basic body styling */
body {
  background-color: #f7fafc; /* Light gray background */
  font-family: 'Inter', sans-serif; /* Example font */
}

/* Ensure container takes up reasonable space */
.container {
    max-width: 1280px; /* Max width for larger screens */
}
</style>
