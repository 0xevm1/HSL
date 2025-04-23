tl;dr It does 24 API calls instead of 360, and fills in the other colors by incrementing the H in HSL by 1, until one of the checkpoint colors from the API response are reached. You can tell the checkpoints in the UI because those entries have more information about the colors, in different formats.

# HSL Color Spectrum Grid

A Vue 3 application that visualizes a spectrum of colors based on user-selected Saturation and Lightness values, using TheColorApi for color names at specific points and client-side generation for intermediary colors.

![Screenshot of the HSL Color Spectrum Grid](https://github.com/0xevm1/HSL/blob/main/hsl-screenshot.png?raw=true)

## Features

* Displays a grid representing a range of hues (0-360) for a given Saturation (S) and Lightness (L).
* Fetches detailed color information, including names, from [TheColorApi](https://www.thecolorapi.com/) for discrete hue points (currently every 15 degrees).
* Generates intermediary colors client-side using HSL-to-Hex conversion.
* Assigns the name of the API-fetched color to the generated intermediary colors within the subsequent hue range, based on the assumption that names change directionally with hue.
* Responsive grid layout using CSS Grid.
* Includes basic loading and error handling indicators.


## Design Choice summary
Initially I wanted to separate concerns like a normal project to demonstrate how I would approach a larger project. In the end I retained the structure of a real modern Vue project but only partially separated concerns. `ColorSwatchGrid.vue` does most of everything. I planned on using Tailwinds for CSS more than I did, the UI became simple, and was not the focus of the assessment, but `ColorSwatch` is a simple card that gets reused.

The use of Promises object directly - as opposed to abstracted by async/await commands - was important to keep the API responses in order and controllable.

The constraints of the project guided the rest of the design.


## Setup

This project requires Node.js and npm (or yarn/pnpm) installed on your machine.

1.  **Clone the repository:**
    ```bash
    git clone HSL
    cd HSL
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Usage

1.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be served at `http://localhost:5173` (or a similar address).

2.  Interact with the Saturation and Lightness controls (presumably provided in a parent component) to trigger the color fetching and generation in the grid.

## Project Structure

* `src/components/ColorSwatchGrid.vue`: The main component that fetches/generates color data and renders the grid of swatches.
* `src/components/ColorSwatch.vue`: A component to display a single color swatch (takes a color object with hex, hsl, and name).
* `src/services/colorApi.ts`: Contains the function `WorkspaceColorData` to interact with TheColorApi `/id` endpoint.
* `src/types/color.ts`: Defines the `ColorData` interface.
* `src/App.vue`: The root component where `ColorSwatchGrid` is used and Saturation/Lightness controls are handled.

## API Reference

This project uses the `/id` endpoint of [TheColorApi](https://www.thecolorapi.com/docs#get-id) to retrieve color information (including names) for specific HSL values. The calls are made from `src/services/colorApi.ts`.

## How Color Data is Handled

1.  When Saturation or Lightness props change, `ColorSwatchGrid.vue` makes API calls to `/id` for 24 different hues (0, 15, 30, ..., 345) at the current S and L.
2.  The component processes the results. For each segment between two API-fetched hues (e.g., between H=330 and H=345), it client-side generates `ColorData` objects for the intermediary hues (H=331, 332, ..., 344).
3.  These client-generated colors are assigned the `name` obtained from the API response at the *start* of the segment (e.g., the name from the H=330 API response is used for hues 331 through 344).
4.  The final array of colors displayed in the grid includes both the original API-fetched colors and the interpolated, client-generated ones.

## Potential Future Improvements / Bonus Challenge

* **Optimize API Calls:** The current implementation makes 24 API calls for every change in S/L. The bonus criteria mentioned exploring ways to get *all* named color ranges (0-360) more efficiently by exploiting the assumption that names change directionally. This only estimates the range at 15 steps to reflect a more human experience, and satisfies the criteria by limiting it to 24 API calls.


* **Enhance Intermediary Color Data:** Currently, client-generated colors only have HSL, Hex, and a copied name. More properties (like RGB string) could be generated client-side if needed.
* **Add User Controls:** Implement input fields for Saturation and Lightness to complement the sliders in `App.vue` (or a dedicated parent component) to allow user interaction.

## Credits

* Built with [Vue 3](https://vuejs.org/).
* Color data and names provided by [TheColorApi](https://www.thecolorapi.com/).
* CSS Grid used for layout.

---

© 0xEVM1 - 2025
