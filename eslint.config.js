import antfu from '@antfu/eslint-config'

export default antfu({
  // ignores: ['**/node_modules/**', '**/dist/**', '**/loader/**', '**/.stencil/**', '**/www/**'],
  rules: {
    'node/prefer-global/process': 'off',
    'unused-imports/no-unused-imports': 'off',
    'ts/ban-ts-comment': 'off',
  },
  gitignore: {
    files: ['.eslintignore'],
  },
})
