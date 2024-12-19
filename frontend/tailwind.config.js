/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "2536px",
      // => @media (min-width: 640px) { ... }

      md: "2536px",
      // => @media (min-width: 768px) { ... }

      lg: "2536px",
      // => @media (min-width: 1024px) { ... }

      xl: "2536px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "2536px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {},
    theme: {
      listStyleType: {
        none: "none",
        disc: "disc",
        decimal: "decimal",
        square: "square",
        roman: "upper-roman",
      },
    },
  },
  plugins: [],
};
