import { parseSearchParams } from '../../bilibili-bangumi-component/src/shared/utils'
import { handler as bilibili } from './bilibili'
import { handler as bgm } from './bgm'

export default async function (request: Request) {
  const url = new URL(request.url)
  const query = parseSearchParams(url) as any

  if (url.pathname.endsWith('bilibili'))
    return await bilibili(query, env ?? undefined)
  else if (url.pathname.endsWith('bgm'))
    return await bgm(query, env ?? undefined)

  return Response.json({
    code: 404,
    message: 'not found',
    data: {},
  }, { status: 404 })
}
