# bilibili-bangumi-component

使用 [WebComponent](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components) 实现的追番列表组件，支持 Bilibili 与 Bangumi （目前支持动画与游戏）

参考 [hexo-bilibili-bangumi](https://github.com/HCLonely/hexo-bilibili-bangumi)，[Bilibili-Bangumi-JS](https://github.com/hans362/Bilibili-Bangumi-JS)，[Roozen的小破站](https://roozen.top/bangumis)

## 特性

- 使用 WebComponent 实现，可用于任何前端应用
- 支持 Bilibili 与 Bangumi
- 支持主题设置
- 适配移动端

## 展示

展示地址 [https://yixiaojiu-blog.netlify.app/docs/record/bangumi/](https://yixiaojiu-blog.netlify.app/docs/record/bangumi/)

<img src="docs/images/screenshot-pc.png" alt="screenshot-pc" />

<img src="docs/images/screenshot-mobile.png" width="60%" alt="screenshot-mobile" />

## 使用

这里有视频教程 *⸜( •ᴗ• )⸝* [https://www.bilibili.com/video/BV1ht421W74u](https://www.bilibili.com/video/BV1ht421W74u)

### `uid` 获取

下面要用

#### Bilibili

登录哔哩哔哩后前往 [https://space.bilibili.com/](https://space.bilibili.com)页面，网址最后的一串数字就是 `uid`

**注意：** 需要将追番列表设置为公开！

#### Bangumi

登录 [Bangumi](https://bangumi.tv/) 后打开控制台(Ctrl+Shift+J)，输入CHOBITS_UID回车，下面会输出 `uid`

---

### 后端

如果你不太方便搭建后端服务，可以先使用这个地址 `https://yi_xiao_jiu-bangumi.web.val.run`

部署后端，请查看 [docs/backend.md](docs/backend.md)

---

### 前端

#### 引入

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

#### 使用组件

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

#### react 使用示例

```jsx
import { defineCustomElements } from 'bilibili-bangumi-component/loader'

defineCustomElements()

export function Bangumi() {
  return (
    <bilibili-bangumi api="api地址" bilibili-uid="bilibili uid" bgm-uid="bangumi uid"></bilibili-bangumi>
  )
}
```

#### 样式覆盖

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

#### 主题

可以直接用标签选择器 `bilibili-bangumi` 进行覆盖

```css
bilibili-bangumi {
  /* 基础文本 */
  --bbc-text-base-color: #4c4948;
  /* 下划线、背景之类的 */
  --bbc-primary-color: #425aef;
}
```

#### 常见问题

[https://vue-quarkd.hellobike.com/#/zh-CN/guide/notice](https://vue-quarkd.hellobike.com/#/zh-CN/guide/notice)

## API

### 组件

| 字段           | 描述                                     | 默认值 |
|:--------------:|:----------------------------------------:|:------:|
| api                | 后端 api 地址                                     | - |
| bilibili-uid       | Bilibili 的 uid，在后端中引入 uid 的 env 后可以不设置 | - |
| bgm-uid            | Bangumi 的 uid，在后端中引入 uid 的 env 后可以不设置  | - |
| bilibili-enabled   | 是否展示 Bilibili                                 | true |
| bgm-enabled        | 是否展示 Bangumi                                  | true|

## TODO

- [ ] UI 优化
- [ ] 自建服务器部署
- [ ] 支持 Bangumi 书籍收藏展示
