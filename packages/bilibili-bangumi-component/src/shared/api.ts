import { formatUrl, serializeSearchParams } from './utils'
import type { AnimeCollection, BgmQuery, BilibiliQuery, Collection, CollectionType, GameCollection, Subject, SubjectType } from './types'

const animeCollectionMap: Record<AnimeCollection, CollectionType> = {
  全部: '0',
  想看: '1',
  在看: '2',
  看过: '3',
}

const gameCollectionMap: Record<GameCollection, CollectionType> = {
  全部: '0',
  在玩: '1',
  想玩: '2',
  玩过: '3',
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
    collectionType: animeCollectionMap[params.collectionType],
  }
  const res = await fetch(`${formatUrl(baseUrl)}/bilibili?${serializeSearchParams(query)}`)
  return await res.json()
}

export async function getBangumi(baseUrl: string, params: BgmParams) {
  const { subjectType } = params
  const collectionMap = subjectType === '动画' ? animeCollectionMap : gameCollectionMap

  const query: BgmQuery = {
    ...params,
    collectionType: collectionMap[params.collectionType],
    subjectType: subjectMap[params.subjectType],
  }
  const res = await fetch(`${formatUrl(baseUrl)}/bgm?${serializeSearchParams(query)}`)
  return await res.json()
}
