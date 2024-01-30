import { parseSearchParams } from '../../bilibili-bangumi-component/src/shared/utils'
import { handler as bilibili } from './bilibili'
import { handler as bgm } from './bgm'

export const runtime = 'edge'
export const preferredRegion = ['hkg1', 'hnd1', 'kix1', 'sin1']

export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = parseSearchParams(url) as any

  if (isMock) {
    if (url.pathname.endsWith('bilibili'))
      return Response.json(mockDataMap.bilibili)
    else
      return Response.json(mockDataMap.bgm)
  }

  if (url.pathname.endsWith('bilibili'))
    return await bilibili(query)
  else
    return await bgm(query)
}
