export type Platform = 'Bilibili' | 'Bangumi' | string

export type Subject = '动画' | '游戏' | '书籍' | '音乐' | '三次元'

export type AnimeCollection = '全部' | '想看' | '在看' | '看过' | '搁置' | '抛弃'

export type GameCollection = '全部' | '想玩' | '在玩' | '玩过' | '搁置' | '抛弃'

export type BookCollection = '全部' | '想读' | '在读' | '读过' | '搁置' | '抛弃'

export type Collection = AnimeCollection | GameCollection | BookCollection

export type CollectionType = '0' | '1' | '2' | '3' | '4' | '5'

/**
 * 收藏标签元组类型
 * 根据不同的主题类型，返回对应的收藏标签数组
 */
export type CollectionLabel =
  ['全部', '想看', '在看', '看过']
  | ['全部', '想看', '在看', '看过', '搁置', '抛弃']
  | ['全部', '想玩', '在玩', '玩过', '搁置', '抛弃']
  | ['全部', '想读', '在读', '读过', '搁置', '抛弃']
  | ['全部', '想听', '在听', '听过', '搁置', '抛弃']

/**
 * 1 动画 2 游戏 3 书籍 4 音乐 5 三次元
 */
export type SubjectType = '1' | '2' | '3' | '4' | '5'

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
