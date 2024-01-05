import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'antfu/top-level-function': 'off',
    'antfu/if-newline': 'off',
    'no-console': 'off',
  },
})
