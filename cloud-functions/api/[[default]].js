// ../bilibili-bangumi-component/src/shared/utils.ts
function serializeSearchParams(searchParams) {
  return Object.entries(searchParams).filter(([, value]) => !!value).map(([key, value]) => `${key}=${value}`).join('&')
}
function parseSearchParams(url) {
  return Object.fromEntries(Array.from(url.searchParams.entries()).filter(([, value]) => !!value))
}
function numberToZh(num) {
  const numString = num.toString()
  if (numString.length < 5)
    return numString
  if (numString.length < 9) {
    const displayStr2 = numString.slice(0, -3)
    const length2 = displayStr2.length
    const sub2 = displayStr2[length2 - 1] === '0' ? '' : `.${displayStr2[length2 - 1]}`
    return `${displayStr2.slice(0, length2 - 1)}${sub2}万`
  }
  const displayStr = numString.slice(0, -7)
  const length = displayStr.length
  const sub = displayStr[length - 1] === '0' ? '' : `.${displayStr[length - 1]}`
  return `${displayStr.slice(0, length - 1)}${sub}亿`
}
function generateRes(params) {
  return Response.json(params, {
    status: params.code,
  })
}

// ../bilibili-bangumi-component/src/shared/custom.ts
const customSubjectMap = {
  1: 'anime',
  2: 'game',
  3: 'book',
  4: 'music',
  5: 'real',
}
const customCollectionMap = {
  1: 'want',
  2: 'doing',
  3: 'done',
}
function customHandler(params, customData) {
  const { subjectType = '1', collectionType = '0', pageNumber = 1, pageSize = 10 } = params
  const collectionData = customData[customSubjectMap[subjectType]]
  if (!collectionData)
    return generateEmpty(pageSize)
  let data
  if (collectionType !== '0') {
    const list = collectionData[customCollectionMap[collectionType]]
    if (!list || !list.length)
      return generateEmpty(pageSize)
    data = list
  }
  else {
    const list = Object.values(collectionData).flat()
    if (!list.length)
      return generateEmpty(pageSize)
    data = list
  }
  return generateRes({
    code: 200,
    message: 'ok',
    data: {
      list: data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
      pageNumber,
      pageSize,
      total: data.length,
      totalPages: Math.ceil(data.length / pageSize),
    },
  })
}
function generateEmpty(pageSize) {
  return generateRes({
    code: 200,
    message: 'ok',
    data: {
      list: [],
      pageNumber: 1,
      pageSize,
      total: 0,
      totalPages: 1,
    },
  })
}

// src/bilibili.ts
async function handler(query, env) {
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
    data: handleFetchData(data.data),
  })
}
function handleFetchData(data) {
  const list = data?.list?.map((item) => {
    const labels = [
      {
        label: item?.new_ep?.index_show,
      },
      {
        label: '评分',
        value: item?.rating?.score,
      },
      {
        label: '播放量',
        value: item?.stat?.view && numberToZh(item.stat.view),
      },
      {
        label: '追番数',
        value: item?.stat?.follow && numberToZh(item.stat.follow),
      },
      {
        label: '投币数',
        value: item?.stat?.coin && numberToZh(item.stat.coin),
      },
      {
        label: '弹幕数',
        value: item?.stat?.danmaku && numberToZh(item.stat.danmaku),
      },
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
      labels: labels.filter(item2 => item2.label),
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

// src/bgm.ts
const subjectTypeMap = {
  1: '2',
  // 动画
  2: '4',
  // 游戏
  3: '1',
  // 书籍
  4: '3',
  // 音乐
  5: '6',
  // 三次元
}
const collectionTypeMap = {
  0: null,
  // 全部
  1: '1',
  // 想看
  2: '3',
  // 在看
  3: '2',
  // 看过
  4: '4',
  // 搁置
  5: '5',
  // 抛弃
}
async function handler2(params, env) {
  const { subjectType = '1', uid: paramsUid, collectionType = '0', pageNumber = 1, pageSize = 10 } = params
  const uid = paramsUid ?? env?.BGM
  if (!uid) {
    return generateRes({
      code: 400,
      message: `uid is required`,
      data: {},
    })
  }
  const searchParams = serializeSearchParams({
    subject_type: subjectTypeMap[subjectType],
    type: collectionTypeMap[collectionType],
    limit: pageSize,
    offset: (Number(pageNumber) - 1) * Number(pageSize),
  })
  const res = await fetch(`https://api.bgm.tv/v0/users/${uid}/collections?${searchParams}`, {
    headers: {
      'User-Agent': `yixiaojiu/bilibili-bangumi-component (https://github.com/yixiaojiu/bilibili-bangumi-component)`,
    },
  })
  const data = await res.json()
  if (!res.ok) {
    return generateRes({
      code: 502,
      message: data.description,
      data: {},
    })
  }
  return generateRes({
    code: 200,
    message: 'ok',
    data: handleFetchData2(data, { pageNumber: Number(pageNumber), pageSize: Number(pageSize) }),
  })
}
function handleFetchData2(data, init) {
  const list = data?.data?.map((item) => {
    const subject = item?.subject
    const labels = [
      {
        label: subject?.eps && `${subject.eps}话`,
      },
      {
        label: '评分',
        value: subject?.score,
      },
      {
        label: '排名',
        value: subject?.rank,
      },
      {
        label: '时间',
        value: subject?.date,
      },
    ]
    return {
      name: subject?.name,
      nameCN: subject?.name_cn,
      summary: subject?.short_summary,
      cover: subject?.images?.large,
      url: subject?.id ? `https://bgm.tv/subject/${subject?.id}` : 'https://bgm.tv/',
      labels: labels.filter((item2) => {
        if ('value' in item2)
          return item2.value
        else
          return item2.label
      }),
    }
  })
  return {
    list: list ?? [],
    ...init,
    total: data.total,
    totalPages: Math.ceil(data.total / init.pageSize),
  }
}

// src/shared/utils.ts
function handleQuery(query) {
  const { pageNumber = 1, pageSize = 10 } = query
  return {
    ...query,
    pageNumber: Number(pageNumber),
    pageSize: Number(pageSize),
  }
}

// ../../cloud-functions/__edgeone_entry__.ts
function getRouteType(pathname) {
  const segments = pathname.split('/').filter(Boolean)
  const lastSegment = segments[segments.length - 1]
  return ['bilibili', 'bgm', 'custom'].includes(lastSegment) ? lastSegment : null
}
async function onRequestGet(context) {
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
  }
  catch {
  }
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
      return await handler(query, env)
    case 'bgm':
      return await handler2(query, env)
    case 'custom':
      return customHandler(query, customData)
    default:
      return generateRes({ code: 404, message: 'Not found', data: {} })
  }
}
export {
  onRequestGet as default,
}
