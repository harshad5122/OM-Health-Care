// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}", // scan all src files for Tailwind classes
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryblue: "#075985",
        primaryorange: "#F59638",
        subtleblue: "#EDF2FF",
        lightblue: "#6792F4",
        primarygreen: "#27AE60",
        secondarygreen: "#1D7C4D",
        subtlegreen: "#C6F1DA",
        primarylightgreen: "#6FCF97",
        primarygrayborder: "#BDBDBD",
        secondarygrayborder: "#CFD6DD",
        primarylightgrey: "#F5F7F9",
        primaryblack: "#272E35",
        primarytextgrey: "#828282",
        primarytextgreen: "#0E4E30",
        primarygreybg: "#DEE3E7",
        primarydarkgrey: "#555F6D",
        primaryyellow: "#F2C94C",
        primaryred: "#EB5757",
        primarypurple: "#9939AC",
        subtlered: "#FCD9D9",
        subtleorange: "#F5930070",
      },
      screens: {
        xs: "300px",
        sm: "640px",
        md: "769px",
        lg: "1024px",
        xl: "1366px",
        "2xl": "1440px",
        base: "1920px",
      },
      zIndex: {
        100: "100",
      },
      boxShadow: {
        custom:
          "rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px",
      },
    },
  },
  plugins: [],
};
