import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist', 'public', 'node_modules'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended, prettier],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    // Los scripts de build venían del ignore global de ESLint, así que
    // sitemap.mjs, prerender.mjs y el resto nunca se revisaron: son los que
    // deciden si el build pasa o si se despliega contenido vacío. Se lintan
    // aparte porque corren en Node, no en el browser.
    files: ['scripts/**/*.{js,mjs}'],
    extends: [js.configs.recommended, prettier],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // prerender.mjs serializa funciones con page.waitForFunction(), que se
    // evalúan dentro de la página de Chromium, no en Node. Por eso ahí sí
    // existen `document` y `root` como globales.
    files: ['scripts/prerender.mjs'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
);