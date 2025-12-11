<template>
  <div class="message-board-page">
    <div class="page-header">
      <h1 class="page-title">
        <span class="neon-pink neon-glow">留言互动</span>
      </h1>
      <p class="page-subtitle">留下您的足迹，与我互动</p>
    </div>

    <div class="board-container">
      <div class="cyber-card message-form-card">
        <h3 class="form-title neon-cyan">发表留言</h3>
        <div class="message-form">
          <div class="form-group">
            <label class="form-label neon-cyan">昵称</label>
            <input
              type="text"
              class="cyber-input"
              v-model="newMessage.name"
              placeholder="输入您的昵称..."
              maxlength="20"
            />
          </div>

          <div class="form-group">
            <label class="form-label neon-cyan">留言内容</label>
            <textarea
              class="cyber-textarea"
              v-model="newMessage.content"
              placeholder="写下您的留言..."
              rows="5"
              maxlength="500"
            ></textarea>
            <div class="char-count">
              <span :class="{'warning': newMessage.content.length > 450}">
                {{ newMessage.content.length }}/500
              </span>
            </div>
          </div>

          <button
            class="cyber-button"
            @click="submitMessage"
            :disabled="!canSubmit"
          >
            <span v-if="loading">发送中...</span>
            <span v-else-if="!canSubmit">请填写完整信息</span>
            <span v-else>发送留言</span>
          </button>
        </div>
      </div>

      <div class="messages-section">
        <div class="messages-header">
          <h3 class="messages-title neon-green">留言列表</h3>
          <div class="message-count">
            共 {{ messages.length }} 条留言
          </div>
        </div>

        <div class="messages-list">
          <transition-group name="message" tag="div">
            <div
              v-for="message in messages"
              :key="message.id"
              class="cyber-card message-item"
            >
              <div class="message-header">
                <div class="message-author">
                  <span class="author-icon neon-pink">▶</span>
                  <span class="author-name neon-cyan">{{ message.name }}</span>
                </div>
                <div class="message-time neon-green">
                  {{ formatTime(message.timestamp) }}
                </div>
              </div>

              <div class="message-content">
                {{ message.content }}
              </div>

              <div class="message-footer">
                <button
                  class="like-btn"
                  @click="toggleLike(message.id)"
                  :class="{ 'liked': message.liked }"
                >
                  <span class="like-icon">{{ message.liked ? '♥' : '♡' }}</span>
                  <span class="like-count">{{ message.likes }}</span>
                </button>
              </div>
            </div>
          </transition-group>

          <div v-if="messages.length === 0" class="empty-state cyber-card">
            <div class="empty-icon neon-purple">[暂无留言]</div>
            <div class="empty-text">成为第一个留言的人吧！</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { messageAPI } from '../utils/api';

export default {
  name: 'MessageBoard',
  data() {
    return {
      newMessage: {
        name: '',
        content: ''
      },
      messages: [],
      loading: false
    }
  },
  computed: {
    canSubmit() {
      return this.newMessage.name.trim() !== '' &&
             this.newMessage.content.trim() !== '' &&
             !this.loading;
    }
  },
  mounted() {
    this.loadMessages();
  },
  methods: {
    async loadMessages() {
      try {
        this.loading = true;
        const response = await messageAPI.getMessages();

        if (response.success && response.data) {
          this.messages = response.data;

          // 检查每条留言的点赞状态
          for (let message of this.messages) {
            try {
              const likeStatus = await messageAPI.checkLikeStatus(message.id);
              if (likeStatus.success) {
                message.liked = likeStatus.data.liked;
              }
            } catch (err) {
              console.error('检查点赞状态失败:', err);
            }
          }
        }
      } catch (error) {
        console.error('加载留言失败:', error);
        this.showNotification('加载留言失败，请稍后重试', 'error');
      } finally {
        this.loading = false;
      }
    },

    async submitMessage() {
      if (!this.canSubmit) return;

      try {
        this.loading = true;
        const response = await messageAPI.submitMessage({
          name: this.newMessage.name.trim(),
          content: this.newMessage.content.trim()
        });

        if (response.success && response.data) {
          // 将新留言添加到列表顶部
          this.messages.unshift(response.data);

          this.newMessage.name = '';
          this.newMessage.content = '';

          this.showNotification('留言发送成功！');
        }
      } catch (error) {
        console.error('提交留言失败:', error);
        this.showNotification(error.message || '提交留言失败，请稍后重试', 'error');
      } finally {
        this.loading = false;
      }
    },

    async toggleLike(messageId) {
      const message = this.messages.find(m => m.id === messageId);
      if (!message) return;

      try {
        const response = await messageAPI.toggleLike(messageId);

        if (response.success && response.data) {
          message.likes = response.data.likes;
          message.liked = response.data.liked;
        }
      } catch (error) {
        console.error('点赞操作失败:', error);
        this.showNotification('操作失败，请稍后重试', 'error');
      }
    },

    formatTime(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now - date;

      if (diff < 60000) {
        return '刚刚';
      } else if (diff < 3600000) {
        return `${Math.floor(diff / 60000)}分钟前`;
      } else if (diff < 86400000) {
        return `${Math.floor(diff / 3600000)}小时前`;
      } else {
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    },

    showNotification(text, type = 'success') {
      const notification = document.createElement('div');
      notification.className = `notification ${type === 'error' ? 'neon-pink' : 'neon-green'}`;
      notification.textContent = text;
      notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        padding: 16px 28px;
        background: rgba(10, 10, 15, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid ${type === 'error' ? 'var(--cyber-neon-pink)' : 'var(--cyber-neon-green)'};
        border-radius: 8px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 2000);
    }
  }
}
</script>

<style scoped>
.message-board-page {
  min-height: calc(100vh - 70px);
  padding: 100px 20px 60px;
  position: relative;
  z-index: 10;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
  animation: fadeInDown 0.6s ease-out;
}

.page-title {
  font-size: 3.5em;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: 2px;
}

.page-subtitle {
  font-size: 1.2em;
  color: var(--cyber-text-secondary);
  letter-spacing: 1px;
}

.board-container {
  animation: fadeInUp 0.8s ease-out 0.2s backwards;
}

.message-form-card {
  margin-bottom: 50px;
}

.form-title {
  font-size: 1.8em;
  margin-bottom: 30px;
  font-weight: 600;
  text-align: center;
}

.message-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-label {
  font-size: 1em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.char-count {
  text-align: right;
  font-size: 0.85em;
  color: var(--cyber-text-secondary);
  margin-top: 4px;
}

.char-count .warning {
  color: var(--cyber-neon-pink);
}

.messages-section {
  margin-top: 50px;
}

.messages-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--cyber-glass-border);
}

.messages-title {
  font-size: 2em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.message-count {
  color: var(--cyber-text-secondary);
  font-size: 0.95em;
  letter-spacing: 1px;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.message-item {
  animation: slideInUp 0.5s ease-out backwards;
  transition: all 0.3s ease;
}

.message-item:hover {
  transform: translateX(5px);
}

.message-enter-active,
.message-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-enter {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.message-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--cyber-glass-border);
}

.message-author {
  display: flex;
  align-items: center;
  gap: 10px;
}

.author-icon {
  font-size: 0.9em;
}

.author-name {
  font-weight: 600;
  font-size: 1.1em;
}

.message-time {
  font-size: 0.9em;
  opacity: 0.8;
  font-weight: 500;
}

.message-content {
  line-height: 1.9;
  color: var(--cyber-text-secondary);
  margin-bottom: 20px;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 1.05em;
}

.message-footer {
  display: flex;
  justify-content: flex-end;
}

.like-btn {
  background: transparent;
  border: 1px solid var(--cyber-neon-pink);
  color: var(--cyber-neon-pink);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
}

.like-btn:hover {
  background: rgba(255, 0, 128, 0.1);
  box-shadow: 0 0 15px rgba(255, 0, 128, 0.3);
  transform: scale(1.05);
}

.like-btn.liked {
  background: rgba(255, 0, 128, 0.15);
  border-color: var(--cyber-neon-pink);
  box-shadow: 0 0 20px rgba(255, 0, 128, 0.4);
}

.like-icon {
  font-size: 1.3em;
  transition: transform 0.3s ease;
}

.like-btn:hover .like-icon {
  transform: scale(1.2);
}

.like-count {
  font-size: 0.95em;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--cyber-text-secondary);
}

.empty-icon {
  font-size: 3.5em;
  margin-bottom: 24px;
  opacity: 0.6;
}

.empty-text {
  font-size: 1.2em;
  letter-spacing: 2px;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .message-board-page {
    padding: 80px 16px 40px;
  }

  .page-title {
    font-size: 2.5em;
  }

  .messages-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .message-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>

