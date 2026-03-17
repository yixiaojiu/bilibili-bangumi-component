import { mockDataMap } from '../mock/index.js'
import { generateRes, handleQuery, parseSearchParams, serializeSearchParams } from '../shared/index.js'

const subjectTypeMap = {
  1: '2', // 动画
  2: '4', // 游戏
  3: '1', // 书籍
  4: '3', // 音乐
  5: '6', // 三次元
}

const collectionTypeMap = {
  0: null, // 全部
  1: '1', // 想看
  2: '3', // 在看
  3: '2', // 看过
  4: '4', // 搁置
  5: '5', // 抛弃
}

export async function handler(params, env) {
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
    data: handleFetchData(data, { pageNumber: Number(pageNumber), pageSize: Number(pageSize) }),
  })
}

function handleFetchData(data, init) {
  const list = (data?.data)?.map((item) => {
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
      labels: labels.filter((item) => {
        if ('value' in item)
          return item.value
        else
          return item.label
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

export default function onRequestGet(context) {
  const { request } = context
  const env = context.env || {}
  const url = new URL(request.url)
  const query = handleQuery(parseSearchParams(url))

  if (env?.MOCK === 'true')
    return Response.json(mockDataMap.bgm)

  return handler(query, env)
}
