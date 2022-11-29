import { defineConfig } from "astro/config";

// https://astro.build/config
import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  vite: {
    server: {
      host: "0.0.0.0",
    },
    ssr: {
      external: ["svgo"],
    },
  },
  integrations: [compress()],
});
