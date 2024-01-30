export type Platform = 'Bilibili' | 'Bangumi'

export type Subject = '动画' | '游戏'

export type Collection = '全部' | '想看' | '在看' | '看过'

export type CollectionType = '0' | '1' | '2' | '3'

export type SubjectType = '1' | '2'

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
   * 1 为动画 2 为游戏
   */
  subjectType?: SubjectType
}

export interface ResponseData {
  list: any
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
