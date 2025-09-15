import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactNative from 'eslint-plugin-react-native';
import expo from 'eslint-plugin-expo';

export default [
  // Global ignores
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.config.js',
      '.vscode/**',
      '.git/**',
      '**/*.log',
      'ios/**',
      'android/**',
      'web-build/**',
      '.expo-shared/**',
    ],
  },
  // Base configuration for all files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'writable',
        module: 'writable',
        require: 'readonly',
        global: 'readonly',
        fetch: 'readonly',
        // React Native / Expo globals
        __DEV__: 'readonly',
        ErrorUtils: 'readonly',
        FormData: 'readonly',
        navigator: 'readonly',
        XMLHttpRequest: 'readonly',
        WebSocket: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      react: react,
      'react-hooks': reactHooks,
      'react-native': reactNative,
      expo: expo,
    },
    rules: {
      ...js.configs.recommended.rules,
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-var-requires': 'error',
      // React rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // React Native rules
      'react-native/no-unused-styles': 'error',
      'react-native/split-platform-components': 'error',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'warn',
      'react-native/no-raw-text': 'off', // Often too restrictive in Expo
      'react-native/sort-styles': 'warn',
      'react-native/no-single-element-style-arrays': 'error',
      // Expo rules
      'expo/no-env-var-destructuring': 'error',
      'expo/no-dynamic-env-var': 'error',
      // General rules
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': 'off', // Using TypeScript version instead
    },
    settings: {
      react: {
        version: 'detect',
      },
      'react-native/style-sheet-object-names': ['StyleSheet', 'styles'],
    },
  },
  // TypeScript specific rules
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-var-requires': 'error',
    },
  },
  // JavaScript specific rules
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  // Config files (Expo, Metro, etc.)
  {
    files: [
      '*.config.{js,ts}',
      '**/*.config.{js,ts}',
      'metro.config.js',
      'app.config.js',
      'app.config.ts',
      'expo.json',
    ],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      'no-console': 'off',
    },
  },
  // Test files
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
