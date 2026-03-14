function generateRes(data) {
  return Response.json(data, { status: data.code })
}

function parseSearchParams(url) {
  return Object.fromEntries(
    Array.from(url.searchParams.entries()).filter(([, value]) => value)
  )
}

const customData = {
  anime: {
    want: [],
    doing: [],
    done: [],
  },
  game: {
    want: [],
    doing: [],
    done: [],
  },
  book: {
    want: [],
    doing: [],
    done: [],
  },
}

function customHandler(query) {
  const { subjectType = '1', collectionType = '0', pageNumber = 1, pageSize = 10 } = query
  const typeMap = { 1: 'anime', 2: 'game', 3: 'book', 4: 'music', 5: 'real' }
  const statusMap = { 1: 'want', 2: 'doing', 3: 'done' }

  const dataType = typeMap[subjectType]
  const data = customData[dataType]

  if (!data) {
    return generateRes({
      code: 200,
      message: 'ok',
      data: { list: [], pageNumber: 1, pageSize, total: 0, totalPages: 1 },
    })
  }

  let list
  if (collectionType !== '0') {
    const status = statusMap[collectionType]
    list = data[status] || []
  }
  else {
    list = Object.values(data).flat()
  }

  return generateRes({
    code: 200,
    message: 'ok',
    data: {
      list: list.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
      pageNumber,
      pageSize,
      total: list.length,
      totalPages: Math.ceil(list.length / pageSize),
    },
  })
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

  // Production: do not expose custom data
  if (!(env?.MOCK === 'true')) {
    return generateRes({
      code: 403,
      message: 'Custom data is not available in production environment',
      data: {},
    })
  }

  // Mock mode: return mock data
  if (env?.MOCK === 'true') {
    return Response.json({
      code: 200,
      message: 'ok',
      data: {
        list: [
          {
            name: '素晴らしき日々～不連続存在～',
            nameCN: '美好的每一天 ～不连续的存在～',
            summary: '由6个故事所演奏的旋律',
            cover: 'https://lain.bgm.tv/pic/cover/l/33/b8/4639_kDq7d.jpg',
            url: 'https://bgm.tv/subject/4639',
            labels: [{ label: '评分', value: 8.9 }, { label: '排名', value: 15 }],
          },
        ],
        pageNumber: 1,
        pageSize: 10,
        total: 1,
        totalPages: 1,
      },
    })
  }

  return customHandler(query)
}
