export function handleQuery(query: { pageNumber?: number, pageSize?: number }) {
  const { pageNumber = 1, pageSize = 10 } = query
  return {
    ...query,
    pageNumber: Number(pageNumber),
    pageSize: Number(pageSize),
  }
}
