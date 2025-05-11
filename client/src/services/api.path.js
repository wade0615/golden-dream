const config = {
  template: 'v1',
  backStagePosts: 'backStage/posts',
  backStageCategory: 'backStage/category',
  auth: 'auth',
  member: 'member',
  test: 'test',
  posts: 'posts',
  category: 'category',
  common: 'common'
};

const template = {
  getTemplate: `${config.template}/test`
};

const auth = {
  login: `${config.auth}/login`,
  getAuthInfo: `${config.auth}/getAuthInfo`,
  refresh: `${config.auth}/refresh`,
  logout: `${config.auth}/logout`,
  getDashboard: `${config.auth}/getDashboard`
};

const test = {
  punchme: `${config.test}/punchme`
};

const posts = {
  getPostList: `${config.posts}/getPostList`,
  getPostById: `${config.posts}/getPostById`
};

const category = {
  getCategoryList: `${config.category}/getCategoryList`
};

const common = {
  getAsideCardDetail: `${config.common}/getAsideCardDetail`
};

const backStage = {
  getBackStagePostList: `${config.backStagePosts}/getBackStagePostList`,
  getBackStagePostById: `${config.backStagePosts}/getBackStagePostById`,
  postBackStageAddPost: `${config.backStagePosts}/postBackStageAddPost`,
  patchBackStageEditPost: `${config.backStagePosts}/patchBackStageEditPost`,
  getBackStageCategoryOptions: `${config.backStageCategory}/getBackStageCategoryOptions`
};

export default {
  template,
  auth,
  test,
  posts,
  category,
  common,
  backStage
};
