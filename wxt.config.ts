import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    name: "YouTube Live Chat Collapsed by Default",
    web_accessible_resources: [
      {
        resources: ["injected.js"],
        matches: ["https://www.youtube.com/*"],
      },
    ],
  },
  modules: ["@wxt-dev/auto-icons"],
  autoIcons: {
    baseIconPath: "assets/icon.svg",
  },
  imports: false,
  srcDir: "src",
});
