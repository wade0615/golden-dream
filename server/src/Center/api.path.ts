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
  logout: '/logout'
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
  getPostList: `/getPostList`,
  getPostById: `/getPostById`
};

export default {
  test,
  common,
  auth,
  posts
};
