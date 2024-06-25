/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        spin: "spin 2s linear infinite",
      },
      keyframes: {
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      textShadow: {
        superhot: "2px 2px 0px #000, 4px 4px 0px #ff7f00",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".text-shadow-superhot": {
          textShadow: "-2px 2px 2px #CE5937;",
        },
      });
    },
  ],
};
