# 使用

## `uid` 获取

下面要用

### Bilibili

登录哔哩哔哩后前往 [https://space.bilibili.com/](https://space.bilibili.com)页面，网址最后的一串数字就是 `uid`

**注意：** 需要将追番列表设置为公开！

### Bangumi

登录 [Bangumi](https://bangumi.tv/) 后打开控制台(Ctrl+Shift+J)，输入CHOBITS_UID回车，下面会输出 `uid`

---

## 后端

如果你不太方便搭建后端服务，可以先使用这个地址 `https://yi_xiao_jiu-bangumi.web.val.run`

部署后端，请查看 [docs/backend.md](./backend.md)

---

## 前端

### 引入

1. 使用 CDN

```html
<script
  type="module"
  src="https://fastly.jsdelivr.net/npm/bilibili-bangumi-component@latest/dist/bilibili-bangumi-component/bilibili-bangumi-component.esm.js"
></script>
```

2. 使用包管理工具

```sh
npm i bilibili-bangumi-component
# or
yarn add bilibili-bangumi-component
# or
pnpm add bilibili-bangumi-component
```

### 使用组件

使用包管理工具引入需要先注册组件

在任意 js 代码中执行

```js
import { defineCustomElements } from 'bilibili-bangumi-component/loader'

defineCustomElements()
```

在任意 html 中使用组件

```html
<!-- 在后端中引入 uid 的 env 后，不需要设置 bilibili 与 bangumi uid -->
<bilibili-bangumi api="api地址" bilibili-uid="bilibili uid" bgm-uid="bangumi uid"></bilibili-bangumi>
```

### react 使用示例

```jsx
import { defineCustomElements } from 'bilibili-bangumi-component/loader'

defineCustomElements()

export function Bangumi() {
  return (
    <bilibili-bangumi api="api地址" bilibili-uid="bilibili uid" bgm-uid="bangumi uid"></bilibili-bangumi>
  )
}
```

### 样式覆盖

由于使用了 [Shadow DOM](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components/Using_shadow_DOM)，因此样式覆盖有一点点麻烦。

由于使用了 [@layer 级联层](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@layer)，所以覆盖样式时不需要担心 CSS 优先级问题

```js
const bilibiliBangumi = document.querySelector('bilibili-bangumi')
const style = document.createElement('style')
style.textContent = `
/* 编写需要覆盖的样式 */

.bbc-tab-item {
  color: #ccc;
}
`
bilibiliBangumi.shadowRoot.appendChild(style)
```

### 主题

可以直接用标签选择器 `bilibili-bangumi` 进行覆盖

```css
bilibili-bangumi {
    /* 基础文本颜色 */
    --bbc-text-base-color: #4c4948;
    /* 标签颜色 */
    --bbc-label-color: #FF9843;
    /* 下划线、背景之类的颜色 */
    --bbc-primary-color: #425aef;
}
```

### 常见问题

[https://vue-quarkd.hellobike.com/#/zh-CN/guide/notice](https://vue-quarkd.hellobike.com/#/zh-CN/guide/notice)

## 第三方集成

- Valaxy: [valaxy-addon-bangumi](https://github.com/YunYouJun/valaxy/tree/main/packages/valaxy-addon-bangumi)

## API

### 组件

| 字段           | 描述                                                 | 类型    | 默认值 |
|:--------------:|:----------------------------------------------------:|:------:|:------:|
| api                | 后端 api 地址                                     |  string | - |
| bilibili-uid       | Bilibili 的 uid，在后端中引入 uid 的 env 后可以不设置 |  string | - |
| bgm-uid            | Bangumi 的 uid，在后端中引入 uid 的 env 后可以不设置  |  string | - |
| bilibili-enabled   | 是否展示 Bilibili                                 |  boolean | true |
| bgm-enabled        | 是否展示 Bangumi                                  |  boolean | true |
| page-size          | 分页大小                                          |  number | 15 |
| custom-enabled     | 是否启动自定义数据源                                |  boolean | false |
| custom-label       | 自定义数据源的展示标签名                             |  string | "'自定义'" |
