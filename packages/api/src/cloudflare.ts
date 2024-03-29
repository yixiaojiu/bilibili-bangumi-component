import { parseSearchParams } from '../../bilibili-bangumi-component/src/shared/utils'
import { handler as bilibili } from './bilibili'
import { handler as bgm } from './bgm'
import { handleQuery } from './shared/utils'

function setCORS(res: Response) {
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Max-Age', '86400')
  return res
}

export default {
  async fetch(request: Request, env: NodeJS.ProcessEnv) {
    const url = new URL(request.url)
    const query = handleQuery(parseSearchParams(url))

    if (isMock) {
      if (url.pathname.endsWith('bilibili'))
        return Response.json(mockDataMap.bilibili)

      else return Response.json(mockDataMap.bgm)
    }

    if (url.pathname.endsWith('bilibili'))
      return setCORS(await bilibili(query, env))
    else if (url.pathname.endsWith('bgm'))
      return setCORS(await bgm(query, env))

    return Response.json({
      code: 404,
      message: 'not found',
      data: {},
    }, { status: 404 })
  },
}
