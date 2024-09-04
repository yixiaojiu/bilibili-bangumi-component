import type { UnionToTuple } from './typeUtils'

export type Platform = 'Bilibili' | 'Bangumi' | string

export type Subject = '动画' | '游戏' | '书籍'

export type AnimeCollection = '全部' | '想看' | '在看' | '看过'

export type GameCollection = '全部' | '想玩' | '在玩' | '玩过'

export type BookCollection = '全部' | '想读' | '在读' | '读过'

export type Collection = AnimeCollection | GameCollection | BookCollection

export type CollectionType = '0' | '1' | '2' | '3'

export type CollectionLabel = UnionToTuple<AnimeCollection> | UnionToTuple<GameCollection> | UnionToTuple<BookCollection>

/**
 * 1 动画 2 游戏 3 书籍
 */
export type SubjectType = '1' | '2' | '3'

export interface BilibiliQuery {
  /**
   * 筛选状态
   * 0 全部
   * 1 想看
   * 2 在看
   * 3 看过
   */
  collectionType?: CollectionType

  uid?: string

  /**
   * 第几页
   */
  pageNumber?: number

  /**
   * 一页多少个
   */
  pageSize?: number
}

export interface BgmQuery extends BilibiliQuery {
  /**
   * 1 为动画 2 为游戏 3 为书籍
   */
  subjectType?: SubjectType
}

export type CustomQuery = Omit<BgmQuery, 'uid'>

interface EmptyData {}

export interface ResponseType {
  code: number
  message: string
  data: ResponseData | EmptyData
}

export interface ResponseData {
  list: ListItem[]
  pageNumber: number
  pageSize: number
  total: number
  totalPages: number
}

export interface ListItem {
  // 原名  b站没有
  name?: string
  // 中文名
  nameCN?: string
  // 简介
  summary: string
  // 封面
  cover?: string
  // 资源链接
  url: string
  // 标签
  labels: LabelItem[]
}

export interface LabelItem {
  label: string
  value?: string | number
}

export type ContainerState = 'large' | 'middle' | 'small'
