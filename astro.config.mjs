import { defineConfig } from "astro/config";

import compress from "astro-compress";

// https://astro.build/config
import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  vite: {
    server: {
      host: "0.0.0.0"
    },
    ssr: {
      external: ["svgo"]
    }
  },
  integrations: [compress(), image()]
});