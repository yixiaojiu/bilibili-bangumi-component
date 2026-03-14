function serializeSearchParams(params) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

function parseSearchParams(url) {
  return Object.fromEntries(
    Array.from(url.searchParams.entries()).filter(([, value]) => value)
  )
}

function numberToZh(num) {
  const numStr = num.toString()
  if (numStr.length < 5) return numStr
  if (numStr.length < 9) {
    const numVal = numStr.slice(0, -4)
    const lastChar = numVal[numVal.length - 1]
    return `${numVal.slice(0, numVal.length - 1)}${lastChar === '0' ? '' : '.'}${lastChar}万`
  }
  const numVal = numStr.slice(0, -8)
  const lastChar = numVal[numVal.length - 1]
  return `${numVal.slice(0, numVal.length - 1)}${lastChar === '0' ? '' : '.'}${lastChar}亿`
}

function generateRes(data) {
  return Response.json(data, { status: data.code })
}

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
      labels: labels.filter((l) => l.label),
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

function handleQuery(query) {
  const { pageNumber = 1, pageSize = 10 } = query
  return {
    ...query,
    pageNumber: Number(pageNumber),
    pageSize: Number(pageSize),
  }
}

export default function onRequestGet(context) {
  const { request } = context
  const env = context.env || {}
  const url = new URL(request.url)
  const query = handleQuery(parseSearchParams(url))

  if (env?.MOCK === 'true') {
    return Response.json({
      code: 200,
      message: 'ok',
      data: {
        list: [
          {
            nameCN: '前进吧！登山少女 第二季',
            summary: '故事承接第一季剧情，葵在重遇喜欢户外活动的青梅竹马朋友日向后，再次进行登山活动。',
            cover: 'http://i0.hdslb.com/bfs/bangumi/47c46badc1c450f22f36b5d27304591db9b0a8c1.jpg',
            url: 'https://www.bilibili.com/bangumi/play/ss4115',
            labels: [{ label: '全24话' }, { label: '评分', value: 9.8 }, { label: '播放量', value: '399.2万' }],
          },
        ],
        pageNumber: 1,
        pageSize: 10,
        total: 120,
        totalPages: 12,
      },
    })
  }

  return bilibiliHandler(query, env)
}
