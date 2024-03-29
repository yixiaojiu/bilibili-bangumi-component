# 自定义数据

```ts
interface CustomData {
  anime?: CollectionData
  game?: CollectionData
  book?: CollectionData
}

interface CollectionData {
  want?: ListItem[]
  doing?: ListItem[]
  done?: ListItem[]
}
interface ListItem {
  name?: string
  nameCN?: string
  summary: string
  cover?: string
  url: string
  labels: LabelItem[]
}
interface LabelItem {
  label: string
  value?: string | number
}
```
