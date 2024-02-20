import { parseSearchParams } from '../../bilibili-bangumi-component/src/shared/utils'
import { handler as bilibili } from './bilibili'
import { handler as bgm } from './bgm'

export default {
  async fetch(request: Request, env: NodeJS.ProcessEnv) {
    const url = new URL(request.url)
    const query = parseSearchParams(url) as any

    if (isMock) {
      if (url.pathname.endsWith('bilibili'))
        return Response.json(mockDataMap.bilibili)
      else
        return Response.json(mockDataMap.bgm)
    }

    if (url.pathname.endsWith('bilibili'))
      return await bilibili(query, env)
    else if (url.pathname.endsWith('bgm'))
      return await bgm(query, env)

    return Response.json({
      code: 404,
      message: 'not found',
      data: {},
    }, { status: 404 })
  },
}
