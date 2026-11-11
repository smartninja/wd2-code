// `bun run lint` runs this in CI (lesson 14 homework). It's ESLint's "flat config":
// one exported list of settings, applied in order.
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // generated folders (the build and Playwright's output) aren't our code
  globalIgnores(["dist", "test-results", "playwright-report"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended, // JavaScript's basic mistakes (unused variables, …)
      tseslint.configs.recommended, // the same, taught to read TypeScript
      reactHooks.configs.flat.recommended, // the rules of hooks (lesson 8)
      reactRefresh.configs.vite, // keeps Vite's hot reload working
    ],
    languageOptions: {
      globals: globals.browser, // window, document, fetch … exist in the browser
    },
  },
]);
