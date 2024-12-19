const category = {
  template: 'v1',
  backStagePosts: 'backStage/posts',
  backStageCategory: 'backStage/category',
  auth: 'auth',
  member: 'member',
  test: 'test',
  posts: 'posts',
  common: 'common'
};

const template = {
  getTemplate: `${category.template}/test`
};

const auth = {
  login: `${category.auth}/login`,
  getAuthInfo: `${category.auth}/getAuthInfo`,
  refresh: `${category.auth}/refresh`,
  logout: `${category.auth}/logout`,
  getDashboard: `${category.auth}/getDashboard`
};

const test = {
  punchme: `${category.test}/punchme`
};

const posts = {
  getPostList: `${category.posts}/getPostList`,
  getPostById: `${category.posts}/getPostById`
};

const common = {
  getAsideCardDetail: `${category.common}/getAsideCardDetail`
};

const backStage = {
  getBackStagePostList: `${category.backStagePosts}/getBackStagePostList`,
  getBackStagePostById: `${category.backStagePosts}/getBackStagePostById`,
  getBackStageCategoryOptions: `${category.backStageCategory}/getBackStageCategoryOptions`
};

export default {
  template,
  auth,
  test,
  posts,
  common,
  backStage
};
