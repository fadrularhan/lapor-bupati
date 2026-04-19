import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#E8F5EE",
          100: "#C6E6D4",
          200: "#9DD3B5",
          300: "#6BBF92",
          400: "#3DAD72",
          500: "#1D6A45",
          600: "#165535",
          700: "#114028",
          800: "#0C2C1C",
          900: "#061710",
        },
        gold: {
          400: "#E8A800",
          500: "#C8960C",
          600: "#A87800",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
