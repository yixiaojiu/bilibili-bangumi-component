import type { BilibiliQuery, LabelItem, ListItem, ResponseData } from '../../bilibili-bangumi-component/src/shared/types'
import { numberToZh, serializeSearchParams } from '../../bilibili-bangumi-component/src/shared/utils'

const { BILIBILI } = process.env

export async function handler(query: BilibiliQuery) {
  const { collectionType = '0', uid = '412686493', pageNumber = '1', pageSize = '10' } = query
  const vmid = uid ?? BILIBILI

  if (!vmid) {
    return Response.json({
      code: 400,
      message: 'uid is required',
      data: {},
    }, { status: 400 })
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

  if (!res.ok) {
    return Response.json({
      code: 502,
      message: data.message,
      data: {},
    }, { status: 502 })
  }

  return Response.json({
    code: 200,
    message: 'ok',
    data: handleFetchData(data.data),
  })
}

function handleFetchData(data: any): ResponseData {
  const list = (data?.list as any[])?.map<ListItem>((item) => {
    const labels: LabelItem[] = [
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
    return {
      nameCN: item.title,
      summary: item.summary,
      cover: item.cover,
      url: item.url,
      labels: labels.filter(item => item.label),
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
