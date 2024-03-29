import path from 'node:path'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'tsup'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

const biliBgmMock = readFileSync(path.resolve(__dirname, './src/mock/bili-bgm.js'), 'utf-8')
const customMock = readFileSync(path.resolve(__dirname, './src/mock/custom.js'), 'utf-8')

export default defineConfig((options) => {
  return {
    entry: ['src/vercel.ts', 'src/val-town.ts', 'src/cloudflare.ts'],
    outDir: path.resolve(__dirname, '../../api'),
    splitting: false,
    minify: !options.watch,
    clean: true,
    format: 'esm',
    banner: {
      js: options.env?.MOCK
        ? `${biliBgmMock}
          ${customMock}
          const isMock = true
      `
        : 'const isMock = false',
    },
  }
})
