import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";
import { defineConfig } from "astro/config";
import remarkDirective from "remark-directive";
import remarkEmbed from "./src/plugins/remarkEmbed";
import remarkContainerDirectives from "./src/plugins/remarkMessage";

// https://astro.build/config
export default defineConfig({
  site: "https://cryptoboxme.com",
  integrations: [mdx(), sitemap(), react(), icon()],
  markdown: {
    remarkPlugins: [remarkDirective, remarkContainerDirectives, remarkEmbed],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  experimental: {
    rustCompiler: true,
  },
});
