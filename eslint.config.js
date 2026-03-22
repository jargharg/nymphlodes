import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  files: ['**/*.{js,ts,vue}'],
  extends: [
  ],
  // add your custom rules here
  rules: {
    'vue/multi-word-component-names': 0,
    'no-unused-vars': 1,
    'comma-dangle': [1, 'always-multiline'],
    'import/no-named-as-default': 0,
    'no-multiple-empty-lines': [1, { max: 1 }],
    'eol-last': 1,
    "vue/first-attribute-linebreak": 0,
    'semi': [1, 'never'],
  },
})
