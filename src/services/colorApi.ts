// src/services/colorApi.ts

import axios, { AxiosError } from 'axios'; // Import axios
import type { ColorData, ColorApiResponse } from '@/types/color';

const API_BASE_URL = 'https://www.thecolorapi.com/id';

/**
 * Fetches color information from The Color API for a given HSL value using axios.
 *
 * @param h - Hue (0-359)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns A Promise resolving to ColorData or null if an error occurs.
 */
export async function fetchColorData(h: number, s: number, l: number): Promise<ColorData | null> {
  // Construct the API URL
  const url = `${API_BASE_URL}?hsl=${h},${s}%,${l}%`;

  try {
    // Fetch data from the API using axios.get
    // Axios automatically parses the JSON response into response.data
    const response = await axios.get<ColorApiResponse>(url);

    // Axios throws an error for non-2xx status codes, so we don't need to check response.ok
    const data = response.data;

    // Map the API response to our internal ColorData structure
    const colorInfo: ColorData = {
      hex: data.hex.value,
      rgb: data.rgb.value,
      hsl: { h, s, l }, // Store original HSL for reference
      name: data.name.value,
      apiResponse: data // Optionally store the raw response
    };

    return colorInfo;

  } catch (error) {
    // Handle potential errors (network, API errors, etc.)
    if (axios.isAxiosError(error)) {
      // Axios-specific error handling
      const axiosError = error as AxiosError;
      console.error(`API Error: ${axiosError.response?.status} ${axiosError.response?.statusText} for URL ${url}`, axiosError.message);
      // You could inspect axiosError.response?.data for more details from the API error response
    } else {
      // Generic error (e.g., network issue before request was made)
      console.error(`Failed to fetch or parse color data for HSL(${h}, ${s}, ${l}):`, error);
    }
    return null; // Return null on any error
  }
}
