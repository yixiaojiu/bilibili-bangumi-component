import { mockDataMap } from '../mock/index.js'
import { generateRes, handleQuery, numberToZh, parseSearchParams, serializeSearchParams } from '../shared/index.js'

async function bilibiliHandler(query, env) {
  const { collectionType = '0', uid: paramsUid, pageNumber = '1', pageSize = '10' } = query
  const vmid = paramsUid ?? env?.BILIBILI

  if (!vmid) {
    return generateRes({
      code: 400,
      message: 'uid is required',
      data: {},
    })
  }

  const searchParams = serializeSearchParams({
    type: 1,
    follow_status: collectionType,
    pn: pageNumber,
    ps: pageSize,
    vmid,
  })

  const res = await fetch(`https://api.bilibili.com/x/space/bangumi/follow/list?${searchParams}`)
  const data = await res.json()

  if (!res.ok || data?.code !== 0) {
    return generateRes({
      code: 502,
      message: data.message,
      data: {},
    })
  }

  return generateRes({
    code: 200,
    message: 'ok',
    data: handleBilibiliData(data.data),
  })
}

function handleBilibiliData(data) {
  const list = data?.list?.map((item) => {
    const labels = [
      { label: item?.new_ep?.index_show },
      { label: '评分', value: item?.rating?.score },
      { label: '播放量', value: item?.stat?.view && numberToZh(item.stat.view) },
      { label: '追番数', value: item?.stat?.follow && numberToZh(item.stat.follow) },
      { label: '投币数', value: item?.stat?.coin && numberToZh(item.stat.coin) },
      { label: '弹幕数', value: item?.stat?.danmaku && numberToZh(item.stat.danmaku) },
    ]

    let cover = item.cover
    if (cover && cover.startsWith('http:')) {
      const url = new URL(cover)
      url.protocol = 'https:'
      cover = url.toString()
    }

    return {
      nameCN: item.title,
      summary: item.summary,
      cover,
      url: item.url,
      labels: labels.filter(l => l.label),
    }
  })

  return {
    list: list ?? [],
    pageNumber: data.pn,
    pageSize: data.ps,
    total: data.total,
    totalPages: Math.ceil(data.total / data.ps),
  }
}

export default function onRequestGet(context) {
  const { request } = context
  const env = context.env || {}
  const url = new URL(request.url)
  const query = handleQuery(parseSearchParams(url))

  if (env?.MOCK === 'true')
    return Response.json(mockDataMap.bilibili)

  return bilibiliHandler(query, env)
}
