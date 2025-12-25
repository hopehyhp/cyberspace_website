<template>
  <div v-if="visible" class="auth-modal-overlay" @click.self="close">
    <div class="auth-modal">
      <div class="auth-modal-header">
        <h2 class="auth-title">
          <span class="neon-cyan">{{ isLogin ? '登录' : '注册' }}</span>
        </h2>
        <button class="close-btn" @click="close">×</button>
      </div>

      <div class="auth-tabs">
        <button
          class="auth-tab"
          :class="{ active: isLogin }"
          @click="switchToLogin"
        >
          登录
        </button>
        <button
          class="auth-tab"
          :class="{ active: !isLogin }"
          @click="switchToRegister"
        >
          注册
        </button>
      </div>

      <div class="auth-form-container">
        <form @submit.prevent="submit" class="auth-form">
          <div class="form-group">
            <label class="form-label neon-cyan">用户名</label>
            <input
              type="text"
              class="cyber-input"
              :class="{ 'input-error': usernameError }"
              v-model="form.username"
              @input="validateUsername"
              @blur="validateUsername"
              placeholder="输入用户名（6-12位）..."
              required
              minlength="6"
              maxlength="12"
            />
            <div v-if="usernameError" class="field-error neon-pink">
              {{ usernameError }}
            </div>
            <div v-else-if="form.username && !usernameError" class="field-hint">
              用户名长度：{{ form.username.length }}/12
            </div>
          </div>

          <div class="form-group">
            <label class="form-label neon-cyan">密码</label>
            <input
              type="password"
              class="cyber-input"
              :class="{ 'input-error': passwordError }"
              v-model="form.password"
              @input="validatePassword"
              @blur="validatePassword"
              placeholder="输入密码（6-12位）..."
              required
              minlength="6"
              maxlength="12"
            />
            <div v-if="passwordError" class="field-error neon-pink">
              {{ passwordError }}
            </div>
            <div v-else-if="form.password && !passwordError" class="field-hint">
              密码长度：{{ form.password.length }}/12
            </div>
          </div>

          <div v-if="!isLogin" class="form-group">
            <label class="form-label neon-cyan">邮箱（可选）</label>
            <input
              type="email"
              class="cyber-input"
              v-model="form.email"
              placeholder="输入邮箱..."
            />
          </div>

          <div v-if="!isLogin" class="form-group">
            <label class="form-label neon-cyan">手机号（可选）</label>
            <input
              type="text"
              class="cyber-input"
              v-model="form.phone"
              placeholder="输入手机号..."
            />
          </div>

          <div v-if="error" class="error-message neon-pink">
            {{ error }}
          </div>

          <button
            type="submit"
            class="cyber-button submit-btn"
            :disabled="loading || !canSubmit"
          >
            <span v-if="loading">{{ isLogin ? '登录中...' : '注册中...' }}</span>
            <span v-else>{{ isLogin ? '登录' : '注册' }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { authAPI, authUtils } from '../utils/api';

export default {
  name: 'AuthModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    defaultMode: {
      type: String,
      default: 'login' // 'login' or 'register'
    }
  },
  data() {
    return {
      isLogin: true,
      loading: false,
      error: '',
      usernameError: '',
      passwordError: '',
      form: {
        username: '',
        password: '',
        email: '',
        phone: ''
      }
    };
  },
  computed: {
    canSubmit() {
      const usernameValid = this.form.username.trim().length >= 6 && 
                           this.form.username.trim().length <= 12 && 
                           !this.usernameError;
      const passwordValid = this.form.password.length >= 6 && 
                           this.form.password.length <= 12 && 
                           !this.passwordError;
      return usernameValid && passwordValid;
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.isLogin = this.defaultMode === 'login';
        this.resetForm();
      }
    },
    defaultMode(newVal) {
      if (this.visible) {
        this.isLogin = newVal === 'login';
        this.resetForm();
      }
    }
  },
  methods: {
    switchToLogin() {
      this.isLogin = true;
      this.error = '';
      this.usernameError = '';
      this.passwordError = '';
      this.resetForm();
    },
    switchToRegister() {
      this.isLogin = false;
      this.error = '';
      this.usernameError = '';
      this.passwordError = '';
      this.resetForm();
    },
    validateUsername() {
      const username = this.form.username.trim();
      if (username === '') {
        this.usernameError = '';
        return;
      }
      if (username.length < 6) {
        this.usernameError = '用户名不能少于6位';
        return;
      }
      if (username.length > 12) {
        this.usernameError = '用户名不能超过12位';
        return;
      }
      this.usernameError = '';
    },
    validatePassword() {
      const password = this.form.password;
      if (password === '') {
        this.passwordError = '';
        return;
      }
      if (password.length < 6) {
        this.passwordError = '密码不能少于6位';
        return;
      }
      if (password.length > 12) {
        this.passwordError = '密码不能超过12位';
        return;
      }
      this.passwordError = '';
    },
    resetForm() {
      this.form = {
        username: '',
        password: '',
        email: '',
        phone: ''
      };
      this.error = '';
      this.usernameError = '';
      this.passwordError = '';
    },
    async submit() {
      // 先进行验证
      this.validateUsername();
      this.validatePassword();
      
      if (!this.canSubmit || this.loading) {
        if (!this.usernameError && this.form.username.trim().length > 0) {
          this.validateUsername();
        }
        if (!this.passwordError && this.form.password.length > 0) {
          this.validatePassword();
        }
        return;
      }

      this.loading = true;
      this.error = '';

      try {
        let response;
        if (this.isLogin) {
          response = await authAPI.login({
            username: this.form.username.trim(),
            password: this.form.password
          });
        } else {
          response = await authAPI.register({
            username: this.form.username.trim(),
            password: this.form.password,
            email: this.form.email.trim() || null,
            phone: this.form.phone.trim() || null
          });
        }

        if (response.success && response.data) {
          // 保存用户信息
          authUtils.setUser(response.data);
          
          // 触发登录成功事件
          this.$emit('login-success', response.data);
          
          // 关闭模态框
          this.close();
          
          // 显示成功消息
          this.showNotification(
            this.isLogin ? '登录成功！' : '注册成功！',
            'success'
          );
        }
      } catch (error) {
        console.error('认证失败:', error);
        this.error = error.message || (this.isLogin ? '登录失败，请检查用户名和密码' : '注册失败，请稍后重试');
      } finally {
        this.loading = false;
      }
    },
    close() {
      this.resetForm();
      this.$emit('close');
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
        z-index: 10001;
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
};
</script>

<style scoped>
.auth-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease;
  margin: 0;
  padding: 0;
  overflow: auto;
}

.auth-modal {
  background: rgba(10, 10, 15, 0.95);
  border: 1px solid var(--cyber-glass-border);
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease;
  position: relative;
  margin: 0;
}

.auth-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--cyber-glass-border);
}

.auth-title {
  font-size: 1.8em;
  font-weight: 700;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--cyber-text-secondary);
  font-size: 2em;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: var(--cyber-neon-pink);
  background: rgba(255, 0, 128, 0.1);
}

.auth-tabs {
  display: flex;
  border-bottom: 1px solid var(--cyber-glass-border);
}

.auth-tab {
  flex: 1;
  padding: 16px;
  background: transparent;
  border: none;
  color: var(--cyber-text-secondary);
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.auth-tab::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--cyber-neon-cyan);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.auth-tab.active {
  color: var(--cyber-neon-cyan);
}

.auth-tab.active::after {
  transform: scaleX(1);
}

.auth-tab:hover {
  color: var(--cyber-text-primary);
  background: rgba(0, 217, 255, 0.05);
}

.auth-form-container {
  padding: 24px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 0.9em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cyber-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(10, 10, 15, 0.6);
  border: 1px solid var(--cyber-glass-border);
  border-radius: 6px;
  color: var(--cyber-text-primary);
  font-family: inherit;
  font-size: 1em;
  transition: all 0.3s ease;
}

.cyber-input:focus {
  outline: none;
  border-color: var(--cyber-neon-cyan);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
}

.cyber-input.input-error {
  border-color: var(--cyber-neon-pink);
  box-shadow: 0 0 15px rgba(255, 0, 128, 0.3);
}

.field-error {
  font-size: 0.85em;
  padding: 6px 0;
  margin-top: 4px;
}

.field-hint {
  font-size: 0.8em;
  color: var(--cyber-text-secondary);
  padding: 4px 0;
  margin-top: 2px;
  opacity: 0.7;
}

.error-message {
  padding: 12px;
  background: rgba(255, 0, 128, 0.1);
  border: 1px solid var(--cyber-neon-pink);
  border-radius: 6px;
  font-size: 0.9em;
  text-align: center;
}

.submit-btn {
  margin-top: 10px;
  width: 100%;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
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
  .auth-modal {
    width: 95%;
    max-height: 95vh;
  }

  .auth-modal-header {
    padding: 20px;
  }

  .auth-form-container {
    padding: 20px;
  }
}
</style>

