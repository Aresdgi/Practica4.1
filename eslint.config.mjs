import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs", // Indica que estás usando CommonJS
      globals: {
        ...globals.node, // Habilita las variables globales de Node.js
      },
    },
  },
  pluginJs.configs.recommended,
];
