// eslint.config.js (ESLint v9+)
import path from "path";
import { fileURLToPath } from "url";

import tseslint from "typescript-eslint";
import eslintPluginImport from "eslint-plugin-import";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname);

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      import: eslintPluginImport,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      next: nextPlugin,
    },
    rules: {
      "@typescript-eslint/return-await": ["warn", "in-try-catch"],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "all",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-namespace": "off",
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
          },
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "type",
            "index",
            "unknown",
          ],
        },
      ],
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "next/no-html-link-for-pages": "error",
      "next/no-img-element": "warn",
      "next/no-unwanted-polyfillio": "warn",
      "next/no-sync-scripts": "error",
      "next/no-document-import-in-page": "error",
      "next/no-duplicate-head": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "jsx-quotes": ["error", "prefer-double"],
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: [path.resolve(rootDir, "tsconfig.json")],
        tsconfigRootDir: rootDir,
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2022,
        sourceType: "module",
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2021,
        JSX: "readonly",
      },
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
      react: {
        version: "detect",
      },
      next: {
        rootDir,
      },
    },
  },
  {
    files: ["**/*.js", "**/*.jsx"],
    plugins: {
      import: eslintPluginImport,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      next: nextPlugin,
    },
    rules: {
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
          },
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "type",
            "index",
            "unknown",
          ],
        },
      ],
      "react/prop-types": "error",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "next/no-html-link-for-pages": "error",
      "next/no-img-element": "warn",
      "next/no-unwanted-polyfillio": "warn",
      "next/no-sync-scripts": "error",
      "next/no-document-import-in-page": "error",
      "next/no-duplicate-head": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "jsx-quotes": ["error", "prefer-double"],
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2022,
        sourceType: "module",
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2021,
        JSX: "readonly",
      },
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
      react: {
        version: "detect",
      },
      next: {
        rootDir,
      },
    },
  },

  {
    files: ["next.config.js", "next.config.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
