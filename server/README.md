# Nest Starter Backend

本專案基於 NestJS 框架，作為所有 side project 的後端服務，並額外整合 ServeStaticModule 提供前端部落格站台。

## 系統需求

- Node.js 18.16
- MySQL
- Redis
- Docker（用於開發環境部署）

## 專案特點

- 完整身份驗證流程（crypto JWT + Cookie）
- Azure AD 整合
- Swagger API 文件
- 模組化架構
- .env 支援多環境配置（local、dev、stage、prod）

## API 文件

Swagger 文件位於 `{host}/v1/api`

## 身份驗證流程（等待修改）

目前使用 crypto 公鑰加密，私鑰解密的類 JWT 機制，比傳統 JWT 更嚴謹一點。

本地開發環境：

```
[POST] /v1/auth/login -> 設定包含 accountId、Refresh (jwt)、Authorization (jwt) 的 cookie
  * Refresh token 以雜湊形式存儲於資料庫
[POST] /v1/auth/logout -> 使 cookie 失效
[GET] /v1/auth/refresh -> 更新存取令牌
[POST] /v1/auth/azure/callback -> 驗證 AzureAD 令牌並產生與 `/v1/auth/login` 相同流程的 access_token 與 refresh_token
```

## 專案生成器（範例而已，實際上並沒有生成器）

本專案提供多種生成器以加速開發：

`gen/res` - 建立完整新端點，包含 controller、service、module、dto、entity 等
- 新增端點時使用
- 範例：`gen/res domain`

`gen/lib` - 建立新函式庫
- 新增第三方或自定義函式庫時使用
- 範例：`gen/lib excel`

`gen/middleware` - 建立新中間件
- 新增中間件時使用
- 範例：`gen/middleware request-timer`

## 開發指令

```
help                          顯示幫助資訊
gen/res                       生成資源
gen/lib                       生成第三方函式庫
gen/middleware                生成中間件
npm run build                 構建 Nest 應用

npm run install               安裝依賴
npm run start:debug           以本地開發模式啟動應用
npm run start:dev             以雲上開發模式啟動應用
npm run start:stage           以測試站台模式啟動應用
npm run start:prod            以正式環境模式啟動應用
```

## 主要依賴

- @nestjs/common: ^8.1.2
- @nestjs/config: ^1.2.1
- @nestjs/jwt: ^8.0.0
- @nestjs/swagger: ^5.1.4
- mysql2: ^3.5.2
- ioredis: ^5.3.2
- class-validator: ^0.13.1
- class-transformer: ^0.4.0

## 開發環境設置

1. 安裝依賴：
```bash
npm install
```

2. 啟動開發環境：
```bash
npm run start:debug
```

3. 啟動正式應用：
```bash
npm run start:prod
```
