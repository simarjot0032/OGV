import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "react/no-unescaped-entities": "off",
      "no-unused-vars": "error",
      "prettier/prettier": [
        "error",
        {
          singleQuote: true,
          endOfLine: "auto",
          tabWidth: 2,
          useTabs: false,
        },
      ],
      quotes: ["error", "single", { avoidEscape: true }],
      indent: ["error", 2, { SwitchCase: 1 }],
      "no-var": "error",
      "no-unused-imports": "error",
    },
  },
];

export default eslintConfig;
