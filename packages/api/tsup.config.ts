import path from 'node:path'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'tsup'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

const mock = readFileSync(path.resolve(__dirname, './src/bilibili.js.mock'), 'utf-8')

export default defineConfig((options) => {
  return {
    entry: ['src/vercel.ts', 'src/val-town.ts'],
    outDir: path.resolve(__dirname, '../../api'),
    splitting: false,
    minify: !options.watch,
    clean: true,
    format: 'esm',
    banner: {
      js: options.env?.MOCK
        ? `${mock}
          const isMock = true
      `
        : 'const isMock = false',
    },
  }
})
