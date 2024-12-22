const test = {
  /** 打我啊笨蛋 */
  punchMe: `/punchMe`,
  /** getFireBase */
  getFireBase: `/getFireBase`,
  /** getDB */
  getDB: `/getDB`
};

const auth = {
  /** 登入 */
  login: '/login',
  /** 登出 */
  logout: '/logout',
  /** 新增後台使用者 */
  addAuthMember: '/addAuthMember'
};

const common = {
  /** 更新 code center */
  updateCodeCenter: `/updateCodeCenter`,
  /** 上傳圖片 */
  uploadImage: `/uploadImage`,
  /** 取得redis keys */
  getRedisKeys: `/getRedisKeys`,
  /** 刪除redis key */
  delRedisKey: `/delRedisKey`,
  /** 設置redis 資料 */
  setRedisData: `/setRedisData`,
  /** 取得側邊欄小卡資訊 */
  getAsideCardDetail: `/getAsideCardDetail`
};

const posts = {
  /** 取得文章列表 */
  getPostList: `/getPostList`,
  /** 取得指定文章 */
  getPostById: `/getPostById`
};

const backStage = {
  posts: {
    /** 取得後台文章列表 */
    getBackStagePostList: `/getBackStagePostList`,
    /** 取得後台指定文章 */
    getBackStagePostById: `/getBackStagePostById`,
    /** 新增文章 */
    postBackStageAddPost: `/postBackStageAddPost`,
    /** 編輯文章 */
    editPost: `/editPost`
  },
  category: {
    /** 取得後台分類下拉選單 */
    getBackStageCategoryOptions: `/getBackStageCategoryOptions`
  }
};

export default {
  test,
  common,
  auth,
  posts,
  backStage
};
