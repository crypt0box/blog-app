import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";
import { defineConfig } from 'astro/config';
import remarkDirective from "remark-directive";
import remarkContainerDirectives from "./src/plugins/remarkMessage";
import remarkYouTubeEmbed from "./src/plugins/remarkYouTubeEmbed";

// https://astro.build/config
export default defineConfig({
  site: "https://cryptoboxme.com",
  integrations: [mdx(), sitemap(), react(), icon()],
  markdown: {
    remarkPlugins: [remarkDirective, remarkContainerDirectives, remarkYouTubeEmbed],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  experimental: {
    rustCompiler: true,
  }
});
