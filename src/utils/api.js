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
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
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

  // 提交新留言
  submitMessage(data) {
    return api.post('/messages', data);
  },

  // 点赞/取消点赞
  toggleLike(messageId) {
    return api.post(`/messages/${messageId}/like`);
  },

  // 检查点赞状态
  checkLikeStatus(messageId) {
    return api.get(`/messages/${messageId}/like-status`);
  }
};

export default api;

