/** @type {import('tailwindcss').Config} */

import Typography from "@tailwindcss/typography";

import colors from "tailwindcss/colors";

const linkHeadingStyles = {
  color: colors.gray[100],
  borderBottomColor: "transparent",
  "&:hover": {
    color: `${colors.gray[900]}`,
  },
};

const hexToRgb = (hex) => {
  hex = hex.replace("#", "");
  hex = hex.length === 3 ? hex.replace(/./g, "$&$&") : hex;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r} ${g} ${b}`;
};

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        // invert: {
        //   css: {
        //     '--tw-prose-body': 'var(--tw-prose-invert-body)',
        //     '--tw-prose-headings': 'var(--tw-prose-invert-headings)',
        //     '--tw-prose-lead': 'var(--tw-prose-invert-lead)',
        //     '--tw-prose-links': 'var(--tw-prose-invert-links)',
        //     '--tw-prose-bold': 'var(--tw-prose-invert-bold)',
        //     '--tw-prose-counters': 'var(--tw-prose-invert-counters)',
        //     '--tw-prose-bullets': 'var(--tw-prose-invert-bullets)',
        //     '--tw-prose-hr': 'var(--tw-prose-invert-hr)',
        //     '--tw-prose-quotes': 'var(--tw-prose-invert-quotes)',
        //     '--tw-prose-quote-borders': 'var(--tw-prose-invert-quote-borders)',
        //     '--tw-prose-captions': 'var(--tw-prose-invert-captions)',
        //     '--tw-prose-kbd': 'var(--tw-prose-invert-kbd)',
        //     '--tw-prose-kbd-shadows': 'var(--tw-prose-invert-kbd-shadows)',
        //     '--tw-prose-code': 'var(--tw-prose-invert-code)',
        //     '--tw-prose-pre-code': 'var(--tw-prose-invert-pre-code)',
        //     '--tw-prose-pre-bg': 'var(--tw-prose-invert-pre-bg)',
        //     '--tw-prose-th-borders': 'var(--tw-prose-invert-th-borders)',
        //     '--tw-prose-td-borders': 'var(--tw-prose-invert-td-borders)',
        //   },
        // },
        slate: {
          "--tw-prose-body": colors.slate[700],
          "--tw-prose-headings": colors.slate[900],
          "--tw-prose-lead": colors.slate[600],
          "--tw-prose-links": colors.slate[900],
          "--tw-prose-bold": colors.slate[900],
          "--tw-prose-counters": colors.slate[500],
          "--tw-prose-bullets": colors.slate[300],
          "--tw-prose-hr": colors.slate[200],
          "--tw-prose-quotes": colors.slate[900],
          "--tw-prose-quote-borders": colors.slate[200],
          "--tw-prose-captions": colors.slate[500],
          "--tw-prose-kbd": colors.slate[900],
          "--tw-prose-kbd-shadows": hexToRgb(colors.slate[900]),
          "--tw-prose-code": colors.slate[900],
          "--tw-prose-pre-code": colors.slate[200],
          "--tw-prose-pre-bg": colors.slate[800],
          "--tw-prose-th-borders": colors.slate[300],
          "--tw-prose-td-borders": colors.slate[200],
          "--tw-prose-invert-body": colors.slate[300],
          "--tw-prose-invert-headings": colors.white,
          "--tw-prose-invert-lead": colors.slate[400],
          "--tw-prose-invert-links": colors.white,
          "--tw-prose-invert-bold": colors.white,
          "--tw-prose-invert-counters": colors.slate[400],
          "--tw-prose-invert-bullets": colors.slate[600],
          "--tw-prose-invert-hr": colors.slate[700],
          "--tw-prose-invert-quotes": colors.slate[100],
          "--tw-prose-invert-quote-borders": colors.slate[700],
          "--tw-prose-invert-captions": colors.slate[400],
          "--tw-prose-invert-kbd": colors.white,
          "--tw-prose-invert-kbd-shadows": hexToRgb(colors.white),
          "--tw-prose-invert-code": colors.white,
          "--tw-prose-invert-pre-code": colors.slate[300],
          "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
          "--tw-prose-invert-th-borders": colors.slate[600],
          "--tw-prose-invert-td-borders": colors.slate[700],
        },
        DEFAULT: {
          css: {
            pre: {
              background: "rgba(205, 200, 255, 0.05)",
            },
            "h2 a": linkHeadingStyles,
            "h3 a": linkHeadingStyles,
            "h4 a": linkHeadingStyles,
            "h5 a": linkHeadingStyles,
            "h6 a": linkHeadingStyles,
            blockquote: {
              fontSize: "90%",
              "p::before": { display: "none" },
              "p::after": { display: "none" },
            },
            a: {
              textDecoration: "none",
              borderBottom: `2px solid ${colors.cyan[800]}`,
              color: colors.cyan[400],
              transition:
                "color 0.2s ease, border-color 0.2s ease, background 0.2s ease",
              "&:hover": {
                color: `${colors.zinc[900]} !important`,
                borderBottomColor: `${colors.cyan[200]} !important`,
                background: colors.cyan[200],
              },
            },
            "pre code": {
              color: "#86e1fc",
              "&::before": { content: `unset !important` },
              "&::after": { content: `unset !important` },
              fontWeight: "normal",
            },
            "[data-rehype-pretty-code-fragment]:nth-of-type(2) pre": {
              "[data-line]::before": {
                content: "counter(line)",
                counterIncrement: "line",
                display: "inline-block",
                width: "1rem",
                marginRight: "1rem",
                textAlign: "right",
                color: colors.slate[600],
              },
              "[data-highlighted-line]::before": {
                color: colors.slate[400],
              },
            },
            "[data-rehype-pretty-code-fragment]": {
              maxWidth: "98%",
              overflowY: "auto",
            },
            // for line numbers
            code: {
              counterReset: "line",
            },
            "code [data-line]::before": {
              counterIncrement: "line",
              content: "counter(line)",
              display: "inline-block",
              width: "1rem",
              marginRight: "1rem",
              textAlign: "right",
              color: "gray",
            },
            "[data-line]": {
              borderLeftWidth: "2px",
              borderLeftColor: "#0000",
              // paddingLeft: "1.5rem",
              // paddingRight: "1.5rem",
            },
            "[data-highlighted-line]": {
              background: "#c8c8ff1a",
              "--tw-border-opacity": "1",
              borderLeftColor: "rgb(96 165 250/var(--tw-border-opacity))",
            },
            "[data-highlighted-chars]": {
              borderRadius: ".25rem",
              backgroundColor: "#52525b80",
              boxShadow: "0 0 0 4px #52525b80",
            },
            "[data-chars-id]": {
              borderBottomWidth: "2px",
              padding: ".25rem",
              "--tw-shadow": "0 0 #0000",
              "--tw-shadow-colored": "0 0 #0000",
              boxShadow:
                "var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)",
            },
            "[data-chars-id] span": { color: "inherit !important" },
          },
        },
      }),
    },
  },
  plugins: [Typography],
};
