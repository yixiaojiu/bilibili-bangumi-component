# bilibili-bangumi-component

使用 [WebComponent](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components) 实现的追番列表组件，支持 Bilibili 与 Bangumi （目前支持动画、游戏与书籍）

参考 [hexo-bilibili-bangumi](https://github.com/HCLonely/hexo-bilibili-bangumi)，[Bilibili-Bangumi-JS](https://github.com/hans362/Bilibili-Bangumi-JS)，[Roozen的小破站](https://roozen.top/bangumis)

## 特性

- 💡 使用 WebComponent 实现，可用于任何前端应用
- 🖼️ 支持 Bilibili 与 Bangumi
- 🎨 支持主题设置
- 🔌 支持自定义数据
- 💪 适配移动端

## 展示

展示地址 [note.yixiaojiu.top/docs/record/bangumi](https://note.yixiaojiu.top/docs/record/show-window/bangumi)

<img src="docs/images/screenshot-pc.png" height="200px" alt="screenshot-pc" />

<img src="docs/images/screenshot-mobile.png" width="240px" alt="screenshot-mobile" />

## 文档

这里有视频教程 *⸜( •ᴗ• )⸝* [https://www.bilibili.com/video/BV1ht421W74u](https://www.bilibili.com/video/BV1ht421W74u)

- 使用： [docs/usage.md](docs/usage.md)
- 部署后端： [docs/backend.md](docs/backend.md)
- 自定义数据源： [docs/custom.md](docs/custom.md)

## 第三方集成

- Valaxy: [valaxy-addon-bangumi](https://github.com/YunYouJun/valaxy/tree/main/packages/valaxy-addon-bangumi)

## How to development

项目采用 monorepo，使用 pnpm 管理依赖，并在 `package.json` 指定了版本，版本对不上可能无法安装，可以把 `package.json` 里的限制删了

```sh
pnpm i
```

### server

server 用的是 vercel 的服务，在本地开发时要关联 vercel 上的一个 project

```sh
pnpm run build:api

# 登陆并关联 vercel
pnpm run dev:vercel
```

仓库在 `./packages/api`

感觉比较麻烦可以直接改前端页面所用到的后端服务 `https://yi_xiao_jiu-bangumi.web.val.run`，文件位置在 `packages/bilibili-bangumi-component/src/index.html:60`，

### client

```sh
pnpm run dev:lib
```

仓库在 `./packages/bilibili-bangumi-component`
