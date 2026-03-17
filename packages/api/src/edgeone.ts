import path from 'node:path'
import { existsSync, mkdirSync, readFile, rmSync, writeFile } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRootDir = path.resolve(__dirname, '../../../')
const outputDir = path.join(projectRootDir, 'node-functions')
const srcDir = path.resolve(__dirname, '..', 'src')
const customSrcDir = path.resolve(projectRootDir, 'packages/bilibili-bangumi-component/src/shared')

function transform(code: string) {
  return code
    .replace(/import .* from '[^']+';/g, '')
    .replace(/import \{[^}]+\} from '[^']+'/g, '')
    .replace(/import \* as \w+ from '[^']+'/g, '')
    .replace(/import type \{[^}]*\} from '[^']+'/g, '')
    .replace(/export async function GET\(request: Request\)/g, 'export default function onRequestGet(context)')
    .replace(/process\.env/g, 'context.env')
    .replace(/\?:/g, ':')
    .replace(/ as any/g, '')
    .replace(/const isMock = true/g, 'const isMock = true')
    .replace(/const isMock = false/g, 'const isMock = false')
    .replace(/export function generateRes\(params\)/g, 'export function generateRes(params) {\n  return Response.json(params, { status: params.code })')
    .replace(/\): ResponseData/g, ')')
    .replace(/: \{ pageNumber: number, pageSize: number \}/g, '')
    .replace(/\?.data\[\]/g, '?.data')
    .replace(/\?.list\[\]/g, '?.list')
    .replace(/ as (?:any|string)(?:\[\])?/g, '')
    .replace(/: any([,)])/g, '$1')
    .replace(/<ListItem>/g, '')
    .replace(/: LabelItem\[\]|: BilibiliQuery|: BgmQuery|: NodeJS\.ProcessEnv|: Record<[^>]+>/g, '')
    .replace(/export interface CustomData[\s\S]*?^\}/gm, '')
    .replace(/export interface CollectionData[\s\S]*?^\}/gm, '')
    .replace(/\/\*\*[\s\S]*?\*\//g, '')
    .replace(/export function (customHandler|generateEmpty)/g, 'function $1')
    .replace(/: CustomQuery|: CustomData|: Response|: number|: ListItem\[\]/g, '')
    .replace(/^['\.\/].*/gm, '')
    .replace(/^$/gm, '')
    .replace(/\n{2,}/g, '\n')
    .trim()
}

function wrapApi(code: string, imports: string, name?: string, isEnv = true) {
  return `${imports}

${code}

export default function onRequestGet(context) {
  const { request } = context${isEnv
? `
  const env = context.env || {}`
: ''}
  const url = new URL(request.url)
  const query = handleQuery(parseSearchParams(url))

  ${name ? `if (env?.MOCK === 'true')\n    return Response.json(mockDataMap.${name})\n\n  return handler(query, env)` : `return customHandler(query, customData)`}
}`
}

function wrapMock(code: string, exports: string) {
  return `${code.replace(/\/\* eslint-disable.*?\*\/\n?/g, '').trim()}\n\nexport { ${exports} }\n`
}

async function buildEdgeOne() {
  // eslint-disable-next-line no-console
  console.info('Building EdgeOne Node Functions...')

  const apiDir = path.resolve(outputDir, 'api')
  const mockDir = path.resolve(outputDir, 'mock')

  if (existsSync(apiDir))
    rmSync(apiDir, { recursive: true })
  if (existsSync(mockDir))
    rmSync(mockDir, { recursive: true })

  mkdirSync(apiDir, { recursive: true })
  mkdirSync(mockDir, { recursive: true })

  const [bilibiliCode, bgmCode, customCodeSrc, mockBiliBgmCode, mockCustomCode] = await Promise.all([
    readFileAsync(path.resolve(srcDir, 'bilibili.ts'), 'utf-8'),
    readFileAsync(path.resolve(srcDir, 'bgm.ts'), 'utf-8'),
    readFileAsync(path.resolve(customSrcDir, 'custom.ts'), 'utf-8'),
    readFileAsync(path.resolve(srcDir, 'mock/bili-bgm.js'), 'utf-8'),
    readFileAsync(path.resolve(srcDir, 'mock/custom.js'), 'utf-8'),
  ])

  const imports = {
    bilibili: `import { mockDataMap } from '../mock/index.js'\nimport { generateRes, handleQuery, numberToZh, parseSearchParams, serializeSearchParams } from '../shared/index.js'`,
    bgm: `import { mockDataMap } from '../mock/index.js'\nimport { generateRes, handleQuery, parseSearchParams, serializeSearchParams } from '../shared/index.js'`,
    custom: `import { customData } from '../mock/index.js'\nimport { generateRes, handleQuery, parseSearchParams } from '../shared/index.js'`,
  }

  await Promise.all([
    writeFileAsync(path.resolve(apiDir, 'bilibili.js'), `${wrapApi(transform(bilibiliCode), imports.bilibili, 'bilibili', true)}\n`),
    writeFileAsync(path.resolve(apiDir, 'bgm.js'), `${wrapApi(transform(bgmCode), imports.bgm, 'bgm', true)}\n`),
    writeFileAsync(path.resolve(apiDir, 'custom.js'), `${wrapApi(transform(customCodeSrc), imports.custom, '', false)}\n`),
    writeFileAsync(path.resolve(mockDir, 'bili-bgm.js'), wrapMock(mockBiliBgmCode, 'mockDataMap')),
    writeFileAsync(path.resolve(mockDir, 'custom.js'), wrapMock(mockCustomCode, 'customData')),
    writeFileAsync(path.resolve(mockDir, 'index.js'), `export { mockDataMap } from './bili-bgm.js'\nexport { customData } from './custom.js'\n`),
  ])

  // eslint-disable-next-line no-console
  console.info('EdgeOne build complete! Output:', path.resolve(outputDir))
}

buildEdgeOne()
