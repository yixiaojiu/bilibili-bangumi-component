# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个使用 WebComponent (Stencil.js) 实现的追番列表组件 monorepo，支持 Bilibili 与 Bangumi 数据源。

**架构：**
- **前端组件库** ([packages/bilibili-bangumi-component/](packages/bilibili-bangumi-component/)): 使用 Stencil.js 构建的 WebComponent 组件
- **后端 API** ([packages/api/](packages/api/)): 无服务器 API，支持 Vercel/Val-Town/Cloudflare 部署
- **构建后 API** ([api/](api/)): 打包后的 API 文件，用于 Vercel 部署

## 常用命令

### 依赖安装
```bash
pnpm i
```

### 前端开发
```bash
# 开发模式（带热更新）
pnpm run dev:lib

# 构建
pnpm run build:lib

# 类型检查
pnpm run ts-check:lib

# 生成新组件
pnpm run generate
```

### 后端开发
```bash
# 构建后端 API
pnpm run build:api

# 构建带 mock 数据的后端
pnpm run build:mock

# 启动 Vercel 开发服务器（需要先关联 Vercel 项目）
pnpm run dev:vercel
```

### 代码质量
```bash
# 运行测试
pnpm test

# Lint 检查
pnpm run lint

# Lint 自动修复
pnpm run lint:fix
```

### 发布
```bash
pnpm run ci:publish
```

## 核心架构

### 前端组件架构 ([packages/bilibili-bangumi-component/](packages/bilibili-bangumi-component/))

- **Stencil.js 配置**: [stencil.config.ts](packages/bilibili-bangumi-component/stencil.config.ts)
- **主组件**: `bilibili-bangumi` ([components/index.tsx](packages/bilibili-bangumi-component/src/components/index.tsx))
- **子组件**:
  - `List`: 列表展示
  - `Tabs`: 标签切换
  - `Pagination`: 分页控制
  - `Skeleton`: 加载骨架屏
  - `Empty`: 空状态
  - `Error`: 错误状态
- **共享模块** ([shared/](packages/bilibili-bangumi-component/src/shared/)):
  - `api.ts`: 数据获取函数
  - `types.ts`: TypeScript 类型定义
  - `utils.ts`: 工具函数

**响应式设计：**
组件使用 `ResizeObserver` 监听容器尺寸变化，通过 `containerState` 控制三种显示模式：
- `large`: > 640px
- `middle`: ≤ 640px
- `small`: ≤ 465px

### 后端 API 架构 ([packages/api/](packages/api/))

后端提供三个端点：
- `/api/bilibili`: Bilibili 追番数据
- `/api/bgm`: Bangumi 数据
- `/api/custom`: 自定义数据源

**支持的部署平台：**
- Vercel Edge Runtime ([vercel.ts](packages/api/src/vercel.ts))
- Val-Town ([val-town.ts](packages/api/src/val-town.ts))
- Cloudflare Workers ([cloudflare.ts](packages/api/src/cloudflare.ts))

**数据转换层：**
- [bilibili.ts](packages/api/src/bilibili.ts): Bilibili API 数据转换
- [bgm.ts](packages/api/src/bgm.ts): Bangumi API 数据转换
- [shared/utils.ts](packages/api/src/shared/utils.ts): 通用响应格式化

### 部署配置

- **Vercel**: [vercel.json](vercel.json) - 路由重写到 `/api/(.*)` → `/api/vercel`
- **环境变量**: `BILIBILI` (Bilibili UID)
- **Mock 模式**: 设置 `MOCK=true` 使用 mock 数据

## 开发注意事项

### 本地开发后端
本地开发时，Vercel 开发服务器需要关联远程 Vercel 项目。或者可以直接修改 [packages/bilibili-bangumi-component/src/index.html:60](packages/bilibili-bangumi-component/src/index.html#L60) 中使用的后端服务地址。

### 包管理器
项目指定了 pnpm@10.3.0，版本不匹配可能导致安装问题。

### Lint-staged
提交前会自动运行 eslint 检查和修复。

### 类型共享
前后端通过 [packages/bilibili-bangumi-component/src/shared/types.ts](packages/bilibili-bangumi-component/src/shared/types.ts) 共享类型定义。后端通过相对路径导入这些类型。
