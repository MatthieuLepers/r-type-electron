module.exports = {
  root: true,
  parserOptions: {
    parser: '@babel/eslint-parser',
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ['plugin:vue/essential', 'airbnb-base'],
  globals: {
    __static: true,
  },
  plugins: [
    'vue',
  ],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      node: {},
      webpack: {
        config: '.electron-vue/webpack.renderer.config.js',
      },
    },
  },
  rules: {
    'global-require': 'off',
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never',
    }],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    // 'no-param-reassign': ['error', {
    //   props: true,
    //   ignorePropertyModificationsFor: [
    //     'state', // for vuex state
    //     'acc', // for reduce accumulators
    //     'e', // for e.returnvalue
    //     'Vue', // For Vue plugins
    //   ],
    // }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      optionalDependencies: ['tests/unit/index.js'],
    }],
    'import/newline-after-import': 'off',
    'no-shadow': 'off',
    // allow debugger during development
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'linebreak-style': ['error', 'unix'],
    'max-len': ['error', {
      code: 512,
      tabWidth: 2,
    }],
    'semi-style': 'off',
    'function-paren-newline': 'off',
    'class-methods-use-this': 'off',
    'object-curly-newline': 'off',
    'vue/custom-event-name-casing': 'off',
    // Projects rules
    'func-names': 'off',
    'new-cap': 'off',
    'no-param-reassign': 'off',
    'import/no-dynamic-require': 'off',
    'vue/no-mutating-props': 'off',
  },
};
