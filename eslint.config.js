import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['**/node_modules/**', '**/dist/**', '**/loader/**', '**/.stencil/**', '**/www/**', '!packages/api/', '/api'],
  rules: {
    'node/prefer-global/process': 'off',
    'unused-imports/no-unused-imports': 'off',
    'ts/ban-ts-comment': 'off',
  },
})
