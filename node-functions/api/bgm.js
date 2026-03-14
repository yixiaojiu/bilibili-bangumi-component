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

function generateRes(data) {
  return Response.json(data, { status: data.code })
}

const subjectTypeMap = {
  1: '2',
  2: '4',
  3: '1',
  4: '3',
  5: '6',
}

const collectionTypeMap = {
  0: null,
  1: '1',
  2: '3',
  3: '2',
  4: '4',
  5: '5',
}

async function bgmHandler(query, env) {
  const { subjectType = '1', uid: paramsUid, collectionType = '0', pageNumber = 1, pageSize = 10 } = query
  const uid = paramsUid ?? env?.BGM

  if (!uid) {
    return generateRes({
      code: 400,
      message: 'uid is required',
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
      'User-Agent': 'yixiaojiu/bilibili-bangumi-component (https://github.com/yixiaojiu/bilibili-bangumi-component)',
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
    data: handleBgmData(data, { pageNumber: Number(pageNumber), pageSize: Number(pageSize) }),
  })
}

function handleBgmData(data, init) {
  const list = data?.data?.map((item) => {
    const subject = item?.subject
    const labels = [
      { label: subject?.eps && `${subject.eps}话` },
      { label: '评分', value: subject?.score },
      { label: '排名', value: subject?.rank },
      { label: '时间', value: subject?.date },
    ]

    return {
      name: subject?.name,
      nameCN: subject?.name_cn,
      summary: subject?.short_summary,
      cover: subject?.images?.large,
      url: subject?.id ? `https://bgm.tv/subject/${subject?.id}` : 'https://bgm.tv/',
      labels: labels.filter((l) => {
        if ('value' in l) return l.value
        else return l.label
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
            name: 'リズと青い鳥',
            nameCN: '莉兹与青鸟',
            summary: '铠塚霙，高中3年级，双簧管演奏者...',
            cover: 'https://lain.bgm.tv/pic/cover/l/1d/35/216371_5926R.jpg',
            url: 'https://bgm.tv/subject/216371',
            labels: [{ label: '1话' }, { label: '评分', value: 8.6 }, { label: '排名', value: 27 }],
          },
        ],
        pageNumber: 1,
        pageSize: 10,
        total: 6,
        totalPages: 1,
      },
    })
  }

  return bgmHandler(query, env)
}
