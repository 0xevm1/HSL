// src/types/color.ts

/**
 * Interface representing the structure of the color data
 * fetched from The Color API and used within the application.
 */
export interface ColorData {
    hex: string;       // Hexadecimal color value (e.g., "#FF0000")
    rgb: string;       // RGB color string (e.g., "rgb(255, 0, 0)")
    hsl: { h: number; s: number; l: number }; // Original HSL values
    name: string;      // Name of the color
    apiResponse?: any; // Optional: Store the raw API response if needed for debugging
  }
  
  /**
   * Interface representing the structure of the relevant parts
   * of the response from The Color API (www.thecolorapi.com).
   */
  export interface ColorApiResponse {
    hex: {
      value: string;
      clean: string;
    };
    rgb: {
      value: string;
      r: number;
      g: number;
      b: number;
    };
    hsl: {
      value: string;
      h: number;
      s: number;
      l: number;
    };
    name: {
      value: string;
      closest_named_hex: string;
      exact_match_name: boolean;
      distance: number;
    };
    // Add other fields from the API if needed
  }
  