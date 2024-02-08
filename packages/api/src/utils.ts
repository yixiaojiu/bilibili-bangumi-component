export function generateRes(params: { code: number, message: string, data: any }) {
  return Response.json(params, {
    status: params.code,
  })
}
