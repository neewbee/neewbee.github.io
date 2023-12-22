import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import glsl from "vite-plugin-glsl";

import { remarkReadingTime } from "./src/utils/remark-reading-time.mjs";

import rehypePrettyCode from "rehype-pretty-code";

import react from "@astrojs/react";

/**
 *  rehypePrettyCode based on shiki
 */
// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    mdx(),
    react({
      include: ["**/react/*"],
    }),
  ],
  markdown: {
    syntaxHighlight: false,
    // remarkPlugins: [remarkReadingTime],
    remarkPlugins: [],
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: "dracula",
          onVisitHighlightedLine(node) {
            console.log("node", node);
            // node.properties.className.push('highlighted');
          },
          onVisitHighlightedWord(node) {
            // node.properties.className = ['word'];
          },
        },
      ],
    ],
    extendDefaultPlugins: true,
  },
  vite: {
    plugins: [
      // https://www.npmjs.com/package/vite-plugin-glsl
      glsl({
        include: [
          // Glob pattern, or array of glob patterns to import
          "**/*.glsl",
          "**/*.wgsl",
          "**/*.vert",
          "**/*.frag",
          "**/*.vs",
          "**/*.fs",
        ],
        exclude: undefined, // Glob pattern, or array of glob patterns to ignore
        warnDuplicatedImports: true, // Warn if the same chunk was imported multiple times
        defaultExtension: "glsl", // Shader suffix when no extension is specified
        compress: false, // Compress output shader code
        watch: true, // Recompile shader on change
        root: "/", // Directory for root imports
      }),
    ],
  },
});

/**
 * prism markdoc
 */
// export default defineConfig({
//   integrations: [tailwind(), mdx(), react()],
//   extends: [prism()],
// }
//

// shiki
// export default defineConfig({
//   integrations: [tailwind(), mdx(), react()],
//   extends: [prism()],
//
//   markdown: {
//     shikiConfig: {
//
//       // Choose from Shiki's built-in themes (or add your own)
//       // https://github.com/shikijs/shiki/blob/main/docs/themes.md
//       theme: 'dracula',
//       // Alternatively, provide multiple themes
//       // https://github.com/antfu/shikiji#lightdark-dual-themes
//       experimentalThemes: {
//         light: 'github-light',
//         dark: 'github-dark',
//       },
//       // Add custom languages
//       // Note: Shiki has countless langs built-in, including .astro!
//       // https://github.com/shikijs/shiki/blob/main/docs/languages.md
//       langs: [],
//       // Enable word wrap to prevent horizontal scrolling
//       wrap: true,
//     },
//   }
// });

// background-color:#282A36;color:#F8F8F2;overflow-x:auto;white-space:pre-wrap;word-wrap:break-word

// export default defineConfig({
//   integrations: [tailwind(), mdx(), react()],
//   markdown: {
//     syntaxHighlight: 'prism',
//   }
// });
