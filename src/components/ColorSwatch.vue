<template>
    <div class="color-swatch border border-gray-300 rounded-lg shadow-sm overflow-hidden text-center p-2 flex flex-col justify-between h-full">
      <div
        class="color-display h-20 mb-2 rounded"
        :style="{ backgroundColor: color.hex }"
        aria-label="Color visualization"
      ></div>
      <div class="color-info text-xs">
        <p class="font-semibold truncate" :title="color.name">{{ color.name }}</p>
        <p class="text-gray-600">{{ color.rgb }}</p>
        <p class="text-gray-500">{{ color.hex }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { ColorData } from '@/types/color';
  import { defineProps } from 'vue';
  
  // Define component props using defineProps
  interface Props {
    color: ColorData;
  }
  const props = defineProps<Props>();
  
  // No additional logic needed here for this simple display component
  </script>
  
  <style scoped>
  /* Scoped styles specific to ColorSwatch */
  .color-swatch {
    /* Add transition for potential future hover effects */
    transition: transform 0.2s ease-in-out;
    background-color: #fff; /* Ensure background for contrast */
  }
  
  .color-swatch:hover {
     transform: scale(1.03); /* Slight scale effect on hover */
  }
  
  .color-display {
    /* Ensure the color block is visible even if the color is very light */
    border: 1px solid rgba(0, 0, 0, 0.05);
  }
  
  /* Ensure text doesn't overflow excessively */
  .color-info p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  </style>
  