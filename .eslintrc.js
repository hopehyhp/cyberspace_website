module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/essential',
    'plugin:prettier/recommended'
  ],
  plugins: ['vue', 'prettier'],
  settings: {
    'import/resolver': {
      node: { extensions: ['.js', '.vue'] }
    }
  },
  rules: {
    // common
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

    // prettier integration
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        singleQuote: true,
        semi: true,
        trailingComma: 'es5',
        arrowParens: 'avoid',
        endOfLine: 'lf'
      }
    ],

    // vue
    'vue/script-setup-uses-vars': 'error',
    'vue/max-attributes-per-line': ['error', { singleline: 5, multiline: { max: 1 } }]
  },
  overrides: [
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@babel/eslint-parser',
        ecmaVersion: 2021,
        sourceType: 'module'
      }
    },
    {
      files: ['**/__tests__/**', '*.spec.js', '*.test.js'],
      env: { jest: true }
    }
  ]
};

