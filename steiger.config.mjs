import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // Disable public-api rule for files in the shared layer
    files: ["./src/shared/**"],
    rules: {
      "fsd/public-api": "off",
    },
  },
]);
