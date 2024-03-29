import { parseSearchParams } from '../../bilibili-bangumi-component/src/shared/utils'
import { handler as bilibili } from './bilibili'
import { handler as bgm } from './bgm'
import { handleQuery } from './shared/utils'

export default async function (request: Request) {
  const url = new URL(request.url)
  const query = handleQuery(parseSearchParams(url))

  let envVal = {}

  try {
    envVal = env
  }
  catch {

  }

  if (url.pathname.endsWith('bilibili'))
    return await bilibili(query, envVal ?? undefined)
  else if (url.pathname.endsWith('bgm'))
    return await bgm(query, envVal ?? undefined)

  return Response.json({
    code: 404,
    message: 'not found',
    data: {},
  }, { status: 404 })
}
