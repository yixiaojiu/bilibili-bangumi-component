import { parseSearchParams } from '../../bilibili-bangumi-component/src/shared/utils'
import { handler as bilibili } from './bilibili'
import { handler as bgm } from './bgm'
import { handleQuery } from './shared/utils'
import { customHandler } from './shared'

export const runtime = 'edge'
export const preferredRegion = ['hkg1', 'hnd1', 'kix1', 'sin1']

export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = handleQuery(parseSearchParams(url))

  if (isMock) {
    if (url.pathname.endsWith('bilibili'))
      return Response.json(mockDataMap.bilibili)
    else if (url.pathname.endsWith('bgm'))
      return Response.json(mockDataMap.bgm)
  }

  let customSource = {}
  try {
    customSource = customData
  }
  catch {

  }

  if (url.pathname.endsWith('bilibili'))
    return await bilibili(query, process.env)
  else if (url.pathname.endsWith('bgm'))
    return await bgm(query, process.env)
  else if (url.pathname.endsWith('custom'))
    return customHandler(query, customSource)

  return Response.json({
    code: 404,
    message: 'not found',
    data: {},
  }, { status: 404 })
}
