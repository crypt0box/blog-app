import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import icon from "astro-icon";
import remarkDirective from "remark-directive";
import remarkContainerDirectives from "./src/plugins/remarkMessage";

// https://astro.build/config
export default defineConfig({
  site: "https://cryptobox.blog",
  integrations: [mdx(), sitemap(), react(), icon()],
  markdown: {
    remarkPlugins: [remarkDirective, remarkContainerDirectives],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
