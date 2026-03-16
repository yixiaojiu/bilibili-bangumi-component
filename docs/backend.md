# 后端

后端使用 Serverless Function 实现

## 方案一：使用 val towm

1. 到 [val town](https://www.val.town/) 注册账号

2. 创建一个 HTTP handler
![HTTP handler](./images/http-handler.png)

3. 将 [api/val-town.js](api/val-town.js) 中的代码复制到此处

![copy-code](./images/copy-code.png)

4. （可选）添加 `uid` env

![val-town-env](./images/val-town-env.png)

## 方案二：使用 vercel

**吐槽：** 一开始是以 vercel 的 [Edge Function](https://vercel.com/docs/functions/edge-functions) 为平台进行开发的，结果基本功能都开发完了，部署测试时发现 vercel 域名被墙了，气晕了 😡😡😡。

需要自己想办法解决 vercel 域名被墙的问题

1. fork 本项目，并在 vercel 中导入

2. 构建配置，并点击 Deploy

![vercel-configure](./images/vercel/configure.png)

3. 检查构建记录中是否注册了 Functions

![alt text](./images/vercel/image.png)

![alt text](./images/vercel/image-1.png)

![alt text](./images/vercel/image-2.png)

4. 如果构建记录中没有 Functions，则是部署资源的根目录出了问题 （如果有 Functions，直接跳过这一步）

![alt text](./images/vercel/image-3.png)

![alt text](./images/vercel/image-4.png)

![alt text](./images/vercel/image-5.png)

![alt text](./images/vercel/image-6.png)

![alt text](./images/vercel/image-7.png)

5. 验证是否部署成功

![alt text](./images/vercel/image-8.png)

![alt text](./images/vercel/image-9.png)

**注意：** vercel 的接口需要加上 `/api` 路径，例如：`https://xxxx.vercel.app/api`

## 方案三：使用 cloudflare

与 val-town 类似，复制代码[cloudflare.js](/api/cloudflare.js)

## 方案四：使用腾讯云 EdgeOne Pages

1. Fork 本项目到自己的 GitHub 仓库

2. 登录 [腾讯云 EdgeOne Pages](https://console.cloud.tencent.com/edgeone/pages) 控制台

3. 创建新项目，选择从 GitHub 导入

4. 选择 fork 的仓库

5. 添加环境变量（可选）

- `BILIBILI`: 你的 Bilibili 的 uid
- `BGM`: 你的 Bangumi 的 uid

6. 部署完成后访问，查看是否数据正常

**注意：** 腾讯云 EdgeOne Pages 的接口需要加上 `/api` 路径，例如：`https://xxxx.edgeone.cool/api`，长期使用需要设置自定义域名
