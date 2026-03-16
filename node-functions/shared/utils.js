export function serializeSearchParams(searchParams) {
  return Object.entries(searchParams)
    .filter(([, value]) => !!value)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
}

export function parseSearchParams(url) {
  return Object.fromEntries(Array.from(url.searchParams.entries()).filter(([, value]) => !!value))
}

export function numberToZh(num) {
  const numString = num.toString()
  if (numString.length < 5)
    return numString

  if (numString.length < 9) {
    const displayStr = numString.slice(0, -3)
    const length = displayStr.length
    const sub = displayStr[length - 1] === '0' ? '' : `.${displayStr[length - 1]}`
    return `${displayStr.slice(0, length - 1)}${sub}万`
  }

  const displayStr = numString.slice(0, -7)
  const length = displayStr.length
  const sub = displayStr[length - 1] === '0' ? '' : `.${displayStr[length - 1]}`
  return `${displayStr.slice(0, length - 1)}${sub}亿`
}

export function generateRes(params) {
  return Response.json(params, {
    status: params.code,
  })
}

export function handleQuery(query) {
  const { pageNumber = 1, pageSize = 10 } = query
  return {
    ...query,
    pageNumber: Number(pageNumber),
    pageSize: Number(pageSize),
  }
}
