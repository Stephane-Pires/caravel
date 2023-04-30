/** @type {import('tailwindcss').Config} */
module.exports = {
  future: {
    // https://github.com/tailwindlabs/tailwindcss/pull/8394
    // Unactive hover on mobile (which has a weird effect - there is no hover on mobile you fool)
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "mdx-components.tsx",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: {
          100: "#FDF7E9",
          200: "#FCF5E2",
          300: "#FBF2DB",
          400: "#FBF0D3",
          500: "#faedcd",
          600: "#F1CE73",
          700: "#EEC356",
          800: "#E8AE1B",
          900: "#B18412",
        },
        accent: {
          100: "#D3F9E1",
          200: "#C2F7D6",
          300: "#B1F5CA",
          400: "#9FF3BE",
          500: "#86EFAC",
          600: "#3FE67C",
          700: "#1CD45F",
          800: "#15A54A",
          900: "#0F7635",
        },
      },
      fontFamily: {
        sans: ["var(--font-open-sans)"],
        mono: ["var(--font-roboto-mono)"],
        script: ["var(--font-merienda)"],
      },
    },
  },
  plugins: [],
}
