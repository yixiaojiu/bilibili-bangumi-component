import type { BgmQuery, LabelItem, ListItem, ResponseData } from '../../bilibili-bangumi-component/src/shared/types'
import { serializeSearchParams } from '../../bilibili-bangumi-component/src/shared/utils'
import { generateRes } from './utils'

const subjectTypeMap = {
  1: '2', // 动画
  2: '4', // 游戏
}

const collectionTypeMap = {
  0: null, // 全部
  1: '1', // 想看
  2: '3', // 在看
  3: '2', // 看过
}

export async function handler(params: BgmQuery, env?: NodeJS.ProcessEnv) {
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
    data: handleFetchData(data, { pageNumber, pageSize }),
  })
}

function handleFetchData(data: any, init: { pageNumber: number, pageSize: number }): ResponseData {
  const list = (data?.data as any[])?.map<ListItem>((item) => {
    const subject = item?.subject
    const labels: LabelItem[] = [
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
    ]
    return {
      name: subject?.name,
      nameCN: subject?.name_cn,
      summary: subject?.short_summary,
      cover: subject?.images?.large,
      url: subject?.id ? `https://bgm.tv/subject/${subject?.id}` : 'https://bgm.tv/',
      labels: labels.filter(item => item.label),
    }
  })
  return {
    list: list ?? [],
    ...init,
    total: data.total,
    totalPages: Math.ceil(data.total / init.pageSize),
  }
}
