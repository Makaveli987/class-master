/** @type {import('tailwindcss').Config} */
const svgToDataUri = require("mini-svg-data-uri");

const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "teacher-purple": "hsl(var(--teacher-purple))",
        info: "hsl(var(--info))",
        "cannon-pink": {
          "50": "#fbf8fa",
          "100": "#f7f0f6",
          "200": "#efdfee",
          "300": "#e1c6de",
          "400": "#cea4ca",
          "500": "#b67faf",
          "600": "#996091",
          "700": "#82507a",
          "800": "#674161",
          "900": "#563950",
          "950": "#351d30",
        },
        killarney: {
          "50": "#f2f7f3",
          "100": "#e0ebe1",
          "200": "#c3d7c6",
          "300": "#9abba1",
          "400": "#6e9978",
          "500": "#477152",
          "600": "#3a6145",
          "700": "#2e4e38",
          "800": "#263f2e",
          "900": "#203427",
          "950": "#111d15",
        },
        plantation: {
          "50": "#f4f9f8",
          "100": "#dbece9",
          "200": "#b7d8d4",
          "300": "#8bbdb8",
          "400": "#639e9b",
          "500": "#498381",
          "600": "#386967",
          "700": "#305554",
          "800": "#2c4949",
          "900": "#263b3b",
          "950": "#122021",
        },
        eggplant: {
          "50": "#faf8fb",
          "100": "#f5f1f6",
          "200": "#eae3eb",
          "300": "#d9ccdb",
          "400": "#c2adc5",
          "500": "#a68aab",
          "600": "#896c8d",
          "700": "#715774",
          "800": "#634d65",
          "900": "#4f3f50",
          "950": "#2f2230",
        },
        "brandy-rose": {
          "50": "#faf7f6",
          "100": "#f5edeb",
          "200": "#eddedb",
          "300": "#dfc6c2",
          "400": "#cba59e",
          "500": "#b38077",
          "600": "#a06b62",
          "700": "#855850",
          "800": "#6f4b45",
          "900": "#5e433e",
          "950": "#31211e",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        progress: {
          "0%": { transform: " translateX(0) scaleX(0)" },
          "40%": { transform: "translateX(0) scaleX(0.4)" },
          "100%": { transform: "translateX(100%) scaleX(0.5)" },
        },
        fadeOutLeft: {
          "0%": {
            opacity: 1,
            transform: "translateX(0)",
          },

          "100%": {
            opacity: 0,
            transform: "translateX(-100%)",
          },
        },
        fadeInRight: {
          "0%": {
            opacity: 0,
            transform: "translateX(-100%)",
          },

          "100%": {
            opacity: 1,
            transform: "translateX(0)",
          },
        },
      },
      transformOrigin: {
        "left-right": "0% 50%",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        progress: "progress 1s infinite linear",
        "fade-out-left": "fadeOutLeft 400ms ease-out",
        "fade-in-right": "fadeInRight 300ms ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          "bg-grid": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-grid-small": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-dot": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
      );
    },
  ],
};

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
