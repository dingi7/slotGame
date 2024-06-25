/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
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
