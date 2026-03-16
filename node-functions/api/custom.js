import { customData } from '../mock/index.js'
import { generateRes, handleQuery, parseSearchParams } from '../shared/index.js'

const customSubjectMap = {
  1: 'anime',
  2: 'game',
  3: 'book',
  4: 'music',
  5: 'real',
}

const customCollectionMap = {
  1: 'want',
  2: 'doing',
  3: 'done',
}

function generateEmpty(pageSize) {
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

function customHandler(params, customData) {
  const { subjectType = '1', collectionType = '0', pageNumber = 1, pageSize = 10 } = params

  const collectionData = customData[customSubjectMap[subjectType]]
  if (!collectionData)
    return generateEmpty(pageSize)

  let data
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

export default function onRequestGet(context) {
  const { request } = context
  const url = new URL(request.url)
  const query = handleQuery(parseSearchParams(url))

  return customHandler(query, customData)
}
