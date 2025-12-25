import axios from 'axios';

// 根据环境自动选择 API 地址
// 优先级：环境变量 > 生产环境相对路径 > 开发环境 localhost
const getBaseURL = () => {
  // 如果设置了环境变量，优先使用
  if (process.env.VUE_APP_API_BASE_URL) {
    return process.env.VUE_APP_API_BASE_URL;
  }
  
  // 生产环境使用相对路径（通过 Nginx 反向代理）
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  
  // 开发环境使用 localhost
  return 'http://localhost:3000/api';
};

// 创建 axios 实例
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    const user = authUtils.getUser();
    // 如果是提交留言的请求，添加用户ID到请求头
    if (config.url === '/messages' && config.method === 'post') {
      if (user && user.id) {
        config.headers['X-User-Id'] = user.id;
      }
    }
    // 如果是删除留言的请求，添加用户ID到请求头
    if (config.url && config.url.startsWith('/messages/') && config.method === 'delete') {
      if (user && user.id) {
        config.headers['X-User-Id'] = user.id;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 如果响应数据中包含 success: false，也当作错误处理
    if (response.data && response.data.success === false) {
      const message = response.data.message || '请求失败';
      return Promise.reject(new Error(message));
    }
    return response.data;
  },
  error => {
    console.error('API 请求错误:', error);
    const message = error.response?.data?.message || error.message || '请求失败';
    return Promise.reject(new Error(message));
  }
);

// 留言板 API
export const messageAPI = {
  // 获取所有留言
  getMessages() {
    return api.get('/messages');
  },

  // 提交新留言（需要登录）
  submitMessage(data) {
    const user = authUtils.getUser();
    if (!user || !user.id) {
      return Promise.reject(new Error('请先登录后再发表留言'));
    }
    return api.post('/messages', data);
  },

  // 点赞/取消点赞
  toggleLike(messageId) {
    return api.post(`/messages/${messageId}/like`);
  },

  // 检查点赞状态
  checkLikeStatus(messageId) {
    return api.get(`/messages/${messageId}/like-status`);
  },

  // 删除留言（仅管理员）
  deleteMessage(messageId) {
    const user = authUtils.getUser();
    if (!user || !user.id) {
      return Promise.reject(new Error('请先登录'));
    }
    if (!authUtils.isAdmin()) {
      return Promise.reject(new Error('您没有权限删除留言'));
    }
    return api.delete(`/messages/${messageId}`);
  }
};

// 用户管理 API
export const userAPI = {
  // 获取所有用户
  getUsers() {
    return api.get('/users');
  },

  // 根据ID获取单个用户
  getUserById(userId) {
    return api.get(`/users/${userId}`);
  },

  // 创建新用户
  createUser(data) {
    return api.post('/users', data);
  },

  // 更新用户
  updateUser(userId, data) {
    return api.put(`/users/${userId}`, data);
  },

  // 删除用户
  deleteUser(userId) {
    return api.delete(`/users/${userId}`);
  }
};

// 认证 API
export const authAPI = {
  // 用户注册
  register(data) {
    return api.post('/auth/register', data);
  },

  // 用户登录
  login(data) {
    return api.post('/auth/login', data);
  },

  // 获取当前用户信息
  getCurrentUser() {
    return api.get('/auth/me');
  }
};

// 用户状态管理工具
export const authUtils = {
  // 保存用户信息到 localStorage
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // 从 localStorage 获取用户信息
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // 清除用户信息
  clearUser() {
    localStorage.removeItem('user');
  },

  // 检查用户是否已登录
  isAuthenticated() {
    return this.getUser() !== null;
  },

  // 检查用户是否是管理员
  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  }
};

export default api;

