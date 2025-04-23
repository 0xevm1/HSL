<template>
    <div class="color-swatch-grid-container p-4">
      <div v-if="loading" class="loading-indicator text-center py-10">
        <p class="text-lg text-gray-600 animate-pulse">Loading colors...</p>
        </div>
  
      <div v-else-if="error" class="error-message text-center py-10">
        <p class="text-lg text-red-600">Error loading colors. Please try again.</p>
        <p class="text-sm text-gray-500">{{ error }}</p>
      </div>
  
      <div v-else-if="colors.length > 0" class="grid-container">
        <ColorSwatch
          v-for="color in colors"
          :key="`${color.hsl.h}-${color.hex}`"
          :color="color"
        />
      </div>
  
       <div v-else class="no-colors-message text-center py-10">
        <p class="text-lg text-gray-500">No colors to display for the selected Saturation and Lightness.</p>
         <p class="text-sm text-gray-500">Adjust the sliders to fetch colors.</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, defineProps, onMounted } from 'vue';
  import type { ColorData } from '@/types/color';
  import { fetchColorData } from '@/services/colorApi';
  import ColorSwatch from './ColorSwatch.vue';
  
  // --- Props ---
  interface Props {
    saturation: number;
    lightness: number;
  }
  const props = defineProps<Props>();
  
  // --- State ---
  const colors = ref<ColorData[]>([]); // Array to hold the fetched color data
  const loading = ref<boolean>(false); // Loading state indicator
  const error = ref<string | null>(null); // Error message state
  const debounceTimer = ref<number | null>(null); // Timer ID for debouncing
  
  // --- Configuration ---
  // Define the hues to fetch (e.g., every 15 degrees)
  const HUES_TO_FETCH = Array.from({ length: 24 }, (_, i) => i * 15); // 0, 15, 30, ..., 345
  const DEBOUNCE_DELAY = 500; // Milliseconds to wait after input stops before fetching
  
  // --- Helper Function: HSL to Hex Conversion ---
  // (Need to add this from the second version)
  function hslToHex(h: number, s: number, l: number): string {
    s /= 100; l /= 100;
    if (s === 0) {
        const gray = Math.round(l * 255).toString(16).padStart(2, '0');
        return `#${gray}${gray}${gray}`;
    }
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const rgb = [f(0), f(8), f(4)];
    const hex = rgb.map(val => Math.round(val * 255).toString(16).padStart(2, '0')).join('');
    return `#${hex}`;
 }

  
  // --- Logic ---
  
  /**
   * Fetches color data for all defined hues based on current props (S, L).
   */
   const fetchAllColors = async () => {
   // ... (initial checks, loading=true, error=null, colors=[], console.log) ...

  try {
    const fetchPromises = HUES_TO_FETCH.map(hue =>
      fetchColorData(hue, props.saturation, props.lightness)
    );

    const results = await Promise.allSettled(fetchPromises);

    const fetchedColors: ColorData[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        // Successfully fetched color data
        fetchedColors.push(result.value);
      } else if (result.status === 'rejected') {
        console.error(`Failed to fetch H=${HUES_TO_FETCH[index]}:`, result.reason);
        // Optionally set a general error state or handle partial data
        error.value = "Some colors could not be loaded."; // Indicate partial success/failure
      }
    });

    // Sort fetched colors by hue to process them sequentially
    fetchedColors.sort((a, b) => a.hsl.h - b.hsl.h);

    const finalColors: ColorData[] = [];

    if (fetchedColors.length > 0) {
        // Process each fetched color and fill in gaps until the next fetched color
        for (let i = 0; i < fetchedColors.length; i++) {
            const currentFetchedColor = fetchedColors[i];
            const nextFetchedColor = fetchedColors[(i + 1) % fetchedColors.length]; // Wrap around for the last segment

            // Add the currently fetched color from the API
            finalColors.push(currentFetchedColor);

            // Determine the start and end hues for filling
            const startHue = currentFetchedColor.hsl.h;
            let endHue = nextFetchedColor.hsl.h;

            // Handle wrap-around for the last segment (e.g., H=345 to H=0)
            if (endHue < startHue) {
                endHue += 360; // Treat it as going from 345 to 360 + 0
            }

            // Get the name from the current fetched color to use for intermediaries
            const nameForIntermediaries = currentFetchedColor.name;
            const s = props.saturation;
            const l = props.lightness;


            // Generate colors for hues between the current and next fetched color
            // Note: Loop from startHue + 1 up to endHue - 1
            for (let h = startHue + 1; h < endHue; h++) {
                // Adjust hue for wrap-around if necessary (e.g., 360 becomes 0, 361 becomes 1, etc.)
                const generatedHue = h % 360;

                // Generate hex client-side
                const generatedHex = hslToHex(generatedHue, s, l);

                // Create a ColorData object for the intermediary color
                // Assign the name from the *start* of the segment
                finalColors.push({
                    hex: generatedHex,
                    rgb: '', // We don't have RGB string from API, could generate if needed
                    hsl: { h: generatedHue, s: s, l: l },
                    name: nameForIntermediaries, // Use the name from the API color at the start of the segment
                    // apiResponse is not available for these
                });
            }
             // Note: The 'nextFetchedColor' will be added as the 'currentFetchedColor' in the next iteration (except for the last segment).
             // The loop structure inherently adds each fetched color once and then fills the gap *after* it.
        }
    }

    // Sort the final array by hue (0-359) before setting state
     finalColors.sort((a, b) => a.hsl.h - b.hsl.h);

    colors.value = finalColors; // Update the state with fetched + generated colors

     // Clear error if all planned fetches were successful and there were colors
     if (fetchedColors.length === HUES_TO_FETCH.length && fetchedColors.length > 0) {
          error.value = null;
     } else if (fetchedColors.length === 0 && HUES_TO_FETCH.length > 0) {
         // Handle case where no colors were fetched at all
         error.value = error.value || "No colors could be loaded.";
     }


  } catch (err: any) {
    console.error('Error fetching and generating color data:', err);
    error.value = err.message || 'An unexpected error occurred during fetching or generation.';
    colors.value = []; // Clear colors on major error
  } finally {
    loading.value = false; // Ensure loading is set to false
  }
};

  
  /**
   * Debounces the execution of fetchAllColors.
   */
  const debouncedFetch = () => {
    if (debounceTimer.value) {
      clearTimeout(debounceTimer.value);
    }
    // Set loading immediately for better UX feedback while typing stops
    // but only if not already loading from a previous trigger
    if (!loading.value) {
        // Show a subtle indication that input is being processed
        // Or you could set loading = true here, but it might flash
    }
  
    debounceTimer.value = window.setTimeout(() => {
      fetchAllColors();
    }, DEBOUNCE_DELAY);
  };
  
  // --- Watchers ---
  
  // Watch for changes in saturation and lightness props
  watch(
    () => [props.saturation, props.lightness],
    (newValues, oldValues) => {
      // Check if values are valid before triggering fetch
       if (newValues[0] >= 0 && newValues[1] >= 0) {
          console.log(`Props changed: S=${newValues[0]}, L=${newValues[1]}`);
          debouncedFetch(); // Trigger debounced fetch on prop change
       } else {
          // Clear results if inputs become invalid
          colors.value = [];
          loading.value = false;
          error.value = null;
          if (debounceTimer.value) clearTimeout(debounceTimer.value);
       }
    },
    { immediate: false } // Don't run immediately on mount, wait for App to provide initial valid values
  );
  
  // --- Lifecycle Hooks ---
  // Optional: Trigger initial fetch if needed, though watching props might be sufficient
  // onMounted(() => {
  //   if (props.saturation >= 0 && props.lightness >= 0) {
  //      fetchAllColors(); // Initial fetch if valid props are passed on mount
  //   }
  // });
  
  </script>
  
  <style scoped>
  /* Scoped styles for the grid */
  .grid-container {
    display: grid;
    /* Responsive grid columns: Adjust as needed */
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); /* Auto-fill columns with min width */
    gap: 1rem; /* Spacing between grid items */
    width: 100%;
  }
  
  /* Styling for loading/error messages */
  .loading-indicator, .error-message, .no-colors-message {
    min-height: 200px; /* Ensure container has some height */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  /* Example using Tailwind for responsiveness (alternative to pure CSS) */
  /*
  @media (min-width: 640px) {
    .grid-container { grid-template-columns: repeat(4, 1fr); }
  }
  @media (min-width: 768px) {
    .grid-container { grid-template-columns: repeat(6, 1fr); }
  }
  @media (min-width: 1024px) {
    .grid-container { grid-template-columns: repeat(8, 1fr); }
  }
  @media (min-width: 1280px) {
    .grid-container { grid-template-columns: repeat(10, 1fr); }
  }
  */
  </style>
  