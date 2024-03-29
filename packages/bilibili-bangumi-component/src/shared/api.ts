import { formatUrl, serializeSearchParams } from './utils'
import type { BgmQuery, BilibiliQuery, Collection, Subject } from './types'
import { animeCollectionMap, collectionMap, subjectMap } from './dataMap'

export interface BilibiliParams {
  uid?: string
  collectionType: Collection
  pageSize: number
  pageNumber: number
}

interface BgmParams extends BilibiliParams {
  subjectType: Subject
}

type CustomParams = Omit<BgmParams, 'uid'>

export async function getBilibili(baseUrl: string, params: BilibiliParams) {
  const query: BilibiliQuery = {
    ...params,
    collectionType: animeCollectionMap[params.collectionType],
  }
  const res = await fetch(`${formatUrl(baseUrl)}/bilibili?${serializeSearchParams(query)}`)
  return await res.json()
}

export async function getBangumi(baseUrl: string, params: BgmParams) {
  const { subjectType } = params

  const query: BgmQuery = {
    ...params,
    collectionType: collectionMap[subjectType][params.collectionType],
    subjectType: subjectMap[params.subjectType],
  }
  const res = await fetch(`${formatUrl(baseUrl)}/bgm?${serializeSearchParams(query)}`)
  return await res.json()
}

export async function getCustom(baseUrl: string, params: CustomParams) {
  const { subjectType } = params

  const query: BgmQuery = {
    ...params,
    collectionType: collectionMap[subjectType][params.collectionType],
    subjectType: subjectMap[params.subjectType],
  }
  const res = await fetch(`${formatUrl(baseUrl)}/custom?${serializeSearchParams(query)}`)
  return await res.json()
}
