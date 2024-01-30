type UnionToIntersection<U> = (
  U extends any
    ? (x: U) => any
    : never
) extends (x: infer R) => any
  ? R
  : never

type LastUnion<U> = UnionToIntersection<
  U extends any
    ? (x: U) => 0
    : never
> extends (x: infer R) => 0
  ? R
  : never

export type UnionToTuple<
  T,
  Last = LastUnion<T>,
> = [T] extends [never]
  ? []
  : [...UnionToTuple<Exclude<T, Last>>, Last]
