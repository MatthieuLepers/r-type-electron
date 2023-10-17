module.exports = {
  root: true,
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@electron-toolkit',
    '@electron-toolkit/eslint-config-ts/eslint-recommended',
    '@vue/eslint-config-typescript/recommended',
    'plugin:import/recommanded',
    'plugin:import/typescript',
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 'latest',
    project: ['./tsconfig.json'],
    extraFileExtensions: ['.vue'],
  },
  plugins: [
    'vue',
    'import',
    '@typescript-eslint',
  ],
  globals: {
    api: true,
  },
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx', '.json'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: true,
    },
  },
  rules: {
    'global-require': 'off',
    'import/no-cycle': 'off',
    'import/no-dynamic-require': 'off',
    'import/extensions': ['error', 'always', {
      js: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    }],
    'import/prefer-default-export': 'off',
    'object-curly-newline': ['error', {
      ImportDeclaration: { multiline: true, minProperties: 4 },
    }],
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'acc', // For reduce accumulator
        'app', // For Vue plugin definition
        'el', // For custom directives
        'vnode', // For custom directives
      ],
    }],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'linebreak-style': ['error', 'unix'],
    'max-len': ['error', {
      code: 512,
      tabWidth: 2,
    }],
    'semi-style': 'off',
    'class-methods-use-this': 'off',
    'func-names': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/require-default-prop': 'off',
  },
};
