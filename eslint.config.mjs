import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // Enforce performance best practices
      'react/no-unsafe': 'error',
      'react/jsx-no-constructed-context-values': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-props-no-spreading': ['error', {
        html: 'enforce',
        custom: 'enforce',
        explicitSpread: 'ignore'
      }],
      // Prevent memory leaks
      'react-hooks/exhaustive-deps': 'error',
      // Enforce security best practices
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error'
    }
  }
];

export default eslintConfig;
