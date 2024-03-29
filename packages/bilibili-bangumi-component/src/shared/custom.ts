import type { CustomQuery, ListItem, SubjectType } from './types'
import { generateRes } from './utils'

export interface CustomData {
  anime?: CollectionData
  game?: CollectionData
  book?: CollectionData
}

/**
 * 以动画为例： want 想看， doing 在看， done 看过
 */
export interface CollectionData {
  want?: ListItem[]
  doing?: ListItem[]
  done?: ListItem[]
}

const customSubjectMap: Record<SubjectType, keyof CustomData> = {
  1: 'anime',
  2: 'game',
  3: 'book',
}

const customCollectionMap: Record<string, keyof CollectionData> = {
  1: 'want',
  2: 'doing',
  3: 'done',
}

export function customHandler(params: CustomQuery, customData: CustomData): Response {
  const { subjectType = '1', collectionType = '0', pageNumber = 1, pageSize = 10 } = params

  const collectionData = customData[customSubjectMap[subjectType]]
  if (!collectionData)
    return generateEmpty(pageSize)

  let data: ListItem[]
  if (collectionType !== '0') {
    const list = collectionData[customCollectionMap[collectionType]]
    if (!list || !list.length)
      return generateEmpty(pageSize)
    data = list
  }
  else {
    const list = Object.values(collectionData).flat()
    if (!list.length)
      return generateEmpty(pageSize)
    data = list
  }

  return generateRes({
    code: 200,
    message: 'ok',
    data: {
      list: data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
      pageNumber,
      pageSize,
      total: data.length,
      totalPages: Math.ceil(data.length / pageSize),
    },
  })
}

function generateEmpty(pageSize: number): Response {
  return generateRes({
    code: 200,
    message: 'ok',
    data: {
      list: [],
      pageNumber: 1,
      pageSize,
      total: 0,
      totalPages: 1,
    },
  })
}
