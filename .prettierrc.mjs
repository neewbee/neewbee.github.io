// .prettierrc.mjs
/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
    {
      files: '*.mdx',
      options: {
        parser: 'mdx',
        embeddedLanguageFormatting: 'off'
      },
    },
  ],
  embeddedLanguageFormatting: 'off'
};
