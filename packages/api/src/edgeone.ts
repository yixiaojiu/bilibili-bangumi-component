import path from 'node:path'
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRootDir = path.resolve(__dirname, '../../../')
const outputDir = path.join(projectRootDir, 'cloud-functions')
const srcDir = path.resolve(__dirname, '..', 'src')

const sharedUtilsPath = path.resolve(projectRootDir, 'packages/bilibili-bangumi-component/src/shared/utils').replace(/\\/g, '/')
const bilibiliPath = path.resolve(projectRootDir, 'packages/api/src/bilibili').replace(/\\/g, '/')
const bgmPath = path.resolve(projectRootDir, 'packages/api/src/bgm').replace(/\\/g, '/')
const apiUtilsPath = path.resolve(projectRootDir, 'packages/api/src/shared/utils').replace(/\\/g, '/')
const apiSharedPath = path.resolve(projectRootDir, 'packages/api/src/shared').replace(/\\/g, '/')

function getEntryCode() {
  return `
import { parseSearchParams, generateRes } from '${sharedUtilsPath}'
import { handler as bilibili } from '${bilibiliPath}'
import { handler as bgm } from '${bgmPath}'
import { handleQuery } from '${apiUtilsPath}'
import { customHandler } from '${apiSharedPath}'

function getRouteType(pathname) {
  const segments = pathname.split('/').filter(Boolean)
  const lastSegment = segments[segments.length - 1]
  return ['bilibili', 'bgm', 'custom'].includes(lastSegment) ? lastSegment : null
}

export default async function onRequestGet(context) {
  const { request } = context
  const env = context.env || {}
  const url = new URL(request.url)
  const query = handleQuery(parseSearchParams(url))
  const routeType = getRouteType(url.pathname)

  let mockDataMap = { bilibili: {}, bgm: {} }
  let customData = {}
  try {
    const mockModule = await import('../mock/index.js')
    mockDataMap = mockModule.mockDataMap || mockDataMap
    customData = mockModule.customData || customData
  } catch {}

  if (!routeType) {
    return generateRes({
      code: 404,
      message: 'Not found. Available routes: /api/bilibili, /api/bgm, /api/custom',
      data: {},
    })
  }

  if (env?.MOCK === 'true' && routeType !== 'custom')
    return Response.json(mockDataMap[routeType])

  switch (routeType) {
    case 'bilibili':
      return await bilibili(query, env)
    case 'bgm':
      return await bgm(query, env)
    case 'custom':
      return customHandler(query, customData)
    default:
      return generateRes({ code: 404, message: 'Not found', data: {} })
  }
}
`
}

function cleanDir(dir: string) {
  if (existsSync(dir))
    rmSync(dir, { recursive: true })
  mkdirSync(dir, { recursive: true })
}

async function buildEdgeOne() {
  // eslint-disable-next-line no-console
  console.info('Building EdgeOne Node Functions...')

  const apiDir = path.resolve(outputDir, 'api')
  const mockDir = path.resolve(outputDir, 'mock')
  const tempEntry = path.resolve(outputDir, '__edgeone_entry__.ts')

  cleanDir(apiDir)
  cleanDir(mockDir)

  const [mockBiliBgmCode, mockCustomCode] = await Promise.all([
    readFile(path.resolve(srcDir, 'mock/bili-bgm.js'), 'utf-8'),
    readFile(path.resolve(srcDir, 'mock/custom.js'), 'utf-8'),
  ])

  const require = createRequire(import.meta.url)
  const esbuild = require('esbuild')

  await writeFile(tempEntry, getEntryCode())

  try {
    await esbuild.build({
      entryPoints: [tempEntry],
      bundle: true,
      format: 'esm',
      platform: 'node',
      target: 'node20',
      outfile: path.resolve(apiDir, '[[default]].js'),
      minify: false,
      treeShaking: true,
      charset: 'utf8',
      external: ['./mock/index.js', '../mock/index.js', '../../mock/index.js'],
      resolveExtensions: ['.ts', '.js', '.json'],
      sourcemap: false,
    })
  }
  finally {
    if (existsSync(tempEntry))
      rmSync(tempEntry)
  }

  await Promise.all([
    writeFile(path.resolve(mockDir, 'bili-bgm.js'), `${mockBiliBgmCode}\nexport { mockDataMap }\n`),
    writeFile(path.resolve(mockDir, 'custom.js'), `${mockCustomCode}\nexport { customData }\n`),
    writeFile(path.resolve(mockDir, 'index.js'), `export { mockDataMap } from './bili-bgm.js'\nexport { customData } from './custom.js'\n`),
  ])

  // eslint-disable-next-line no-console
  console.info('EdgeOne build complete! Output:', outputDir)

  execSync('npx eslint --fix cloud-functions/', { cwd: projectRootDir, stdio: 'pipe' })
  // eslint-disable-next-line no-console
  console.info('ESLint fix applied')
}

buildEdgeOne()
