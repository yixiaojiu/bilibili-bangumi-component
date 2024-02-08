import { formatUrl, serializeSearchParams } from './utils'
import type { BgmQuery, BilibiliQuery, Collection, CollectionType, Subject, SubjectType } from './types'

const collectionMap: Record<Collection, CollectionType> = {
  全部: '0',
  想看: '1',
  在看: '2',
  看过: '3',
}

const subjectMap: Record<Subject, SubjectType> = {
  动画: '1',
  游戏: '2',
}

export interface BilibiliParams {
  uid?: string
  collectionType: Collection
  pageSize: number
  pageNumber: number
}

interface BgmParams extends BilibiliParams {
  subjectType: Subject
}

export async function getBilibili(baseUrl: string, params: BilibiliParams) {
  const query: BilibiliQuery = {
    ...params,
    collectionType: collectionMap[params.collectionType],
  }
  const url = new URL(baseUrl)
  const res = await fetch(`${formatUrl(url)}/bilibili?${serializeSearchParams(query)}`)
  return await res.json()
}

export async function getBangumi(baseUrl: string, params: BgmParams) {
  const query: BgmQuery = {
    ...params,
    collectionType: collectionMap[params.collectionType],
    subjectType: subjectMap[params.subjectType],
  }
  const url = new URL(baseUrl)
  const res = await fetch(`${formatUrl(url)}/bgm?${serializeSearchParams(query)}`)
  return await res.json()
}
