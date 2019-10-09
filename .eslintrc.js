module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/recommended',
    '@vue/standard',
    '@vue/typescript'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-cond-assign': 'error',
    'no-constant-condition': 'error',
    'no-eval': 'error',
    'no-eq-null': 'error',
    'no-sparse-arrays': 'error',
    'no-tabs': 'error',
    'no-extra-semi': 'error',
    'no-useless-constructor': 'off',
    'no-multiple-empty-lines': 'off',
    'use-isnan': 'error',
    'object-property-newline': [
      'error',
      { allowAllPropertiesOnSameLine: true }
    ],
    'space-before-function-paren': ['error', 'never'],
    'func-call-spacing': ['error', 'never'],
    'arrow-parens': ['error', 'always'],
    'arrow-spacing': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'linebreak-style': ['error', 'unix'],
    'unicode-bom': ['error', 'never'],
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'padded-blocks': 'off',

    // vue
    'vue/html-indent': 'error',
    'vue/html-quotes': ['error', 'double'],
    'vue/html-self-closing': 'error',
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/comma-dangle': ['error', 'always-multiline'],
    'vue/no-unused-components': 'error',
    'vue/v-bind-style': ['error', 'shorthand'],
    'vue/v-on-style': ['error', 'shorthand'],
    'vue/attribute-hyphenation': ['error', 'always'],
    'vue/max-attributes-per-line': ['error', {
      'singleline': 4,
      'multiline': {
        'max': 1,
        'allowFirstLine': false,
      }
    }],

    // typescript
    '@typescript-eslint/indent': ['error', 2, { 'SwitchCase': 1 }],
    '@typescript-eslint/camelcase': 'error',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-triple-slash-reference': 'error',
    '@typescript-eslint/member-delimiter-style': 'error',
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  }
};
