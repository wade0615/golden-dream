const category = {
  template: 'v1',
  auth: 'auth',
  member: 'member',
  test: 'test',
  posts: 'posts'
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
  getPostList: `${category.posts}/getPostList`
};

export default {
  template,
  auth,
  test,
  posts
};
