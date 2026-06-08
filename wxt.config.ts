import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/auto-icons"],
  autoIcons: {
    baseIconPath: "assets/logo.svg",
  },
  manifest: {
    browser_specific_settings: {
      gecko: {
        id: "typst-qol@contrapoetra.com",
      },
    },
    web_accessible_resources: [
      {
        // wxt handles the leading slash, but providing it without is often safer for glob matching
        resources: ["fonts/*.ttf", "fonts/*.woff2"],
        matches: ["*://typst.app/*"],
      },
    ],
  },
});
