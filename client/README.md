### 基本規範

- 資料夾名稱使用 小駝峰命名 (camelCase)
- JSX 元件名稱使用 大駝峰命名 (PascalCase)
- css/sass/js 名稱使用 小駝峰命名 (camelCase)
- import 使用絕對路徑 (例: src/components/template)

### src 檔案結構

src
┣ components
┣ config
┣ constants
┣ features
┣ layout
┣ pages
┣ routes
┣ services
┣ store
┣ styles
┗ utils

### src 檔案夾說明

##### components/

- 無相依性的共用元件

##### constants/

- 常數具有不變的特性，通常以全大寫 + 下底線 來命名
  例如：圓周率 PI，就會是 Math.PI；或是 client id 會寫成 CLIENT_ID

#### features/

- 有相依性的可複用組件，例 Header, Footer, SideMenu

##### Pages/

- 大頁面元件，每個頁面會關聯到一個 route 的名稱，巢狀包覆即為子 route
- 所有的 route 都放在 PageRoute.js
- 建立一個 sub folder 放該頁面的專用的功能元件
  (ps 若為共用元件，請建立在 components)

### Routes/

- react-router-dom v6 用法
- router 與 breadcrumb 都在這設定
- 每個 page Component 寫與 route 的 pageTitle 一樣的中文註解

##### services/

- 根據後端的 api 名稱建立各個資料夾
- 所有的資料夾註冊到 api.js

#### stores/

- 全域的狀態儲存
- 在 slice 建立 reducer 跟 action

#### utils/

- 方便重複使用的 functions

 <!-- 參考
  https://engineering.udacity.com/react-folder-structure-for-enterprise-level-applications-f8384eff162b
 -->
