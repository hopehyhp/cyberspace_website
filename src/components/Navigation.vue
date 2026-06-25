<template>
  <nav class="navigation">
    <div class="nav-container">
      <div class="nav-brand">
        <router-link to="/" class="brand-link">
          <span class="brand-text neon-cyan">CYBERSPACE</span>
          <span class="brand-dot neon-pink">.</span>
        </router-link>
      </div>

      <div class="nav-menu" :class="{ active: menuOpen }">
        <router-link to="/" class="nav-link" exact-active-class="active" @click="closeMenu">
          <span class="nav-icon">⌂</span>
          <span class="nav-text">首页</span>
        </router-link>

        <router-link to="/tech-sharing" class="nav-link" active-class="active" @click="closeMenu">
          <span class="nav-icon">📚</span>
          <span class="nav-text">技术分享</span>
        </router-link>

        <router-link to="/entertainment" class="nav-link" active-class="active" @click="closeMenu">
          <span class="nav-icon">🎮</span>
          <span class="nav-text">娱乐</span>
        </router-link>
        <router-link to="/messages" class="nav-link" active-class="active" @click="closeMenu">
          <span class="nav-icon">✉</span>
          <span class="nav-text">留言</span>
        </router-link>

        <router-link to="/about" class="nav-link" active-class="active" @click="closeMenu">
          <span class="nav-icon">⚡</span>
          <span class="nav-text">关于</span>
        </router-link>

        <router-link
          v-if="isAdmin"
          to="/users"
          class="nav-link"
          active-class="active"
          @click="closeMenu"
        >
          <span class="nav-icon">👥</span>
          <span class="nav-text">用户管理</span>
        </router-link>
      </div>

      <div class="nav-right">
        <div class="user-menu-container" v-click-outside="closeUserMenu">
          <button
            class="user-avatar-btn"
            @click="toggleUserMenu"
            :title="currentUser ? currentUser.username : '未登录'"
          >
            <div class="user-avatar">
              {{ currentUser ? currentUser.username.charAt(0).toUpperCase() : '?' }}
            </div>
          </button>

          <div class="user-menu" :class="{ active: userMenuOpen }">
            <div v-if="currentUser" class="user-info">
              <div class="user-name">{{ currentUser.username }}</div>
              <div class="user-role">{{ getRoleText(currentUser.role) }}</div>
            </div>
            <div v-else class="user-info">
              <div class="user-name">未登录</div>
            </div>
            <div class="user-menu-divider"></div>
            <button v-if="!currentUser" class="user-menu-item" @click="openAuthModal('login')">
              登录
            </button>
            <button v-if="!currentUser" class="user-menu-item" @click="openAuthModal('register')">
              注册
            </button>
            <button v-if="currentUser" class="user-menu-item" @click="logout">退出登录</button>
          </div>
        </div>

        <button
          class="nav-toggle"
          @click="toggleMenu"
          :aria-label="menuOpen ? '关闭菜单' : '打开菜单'"
        >
          <span class="toggle-line" :class="{ active: menuOpen }"></span>
          <span class="toggle-line" :class="{ active: menuOpen }"></span>
          <span class="toggle-line" :class="{ active: menuOpen }"></span>
        </button>
      </div>
    </div>

    <AuthModal
      :visible="authModalVisible"
      :default-mode="authModalMode"
      @close="closeAuthModal"
      @login-success="handleLoginSuccess"
    />
  </nav>
</template>

<script>
import { authUtils } from '../utils/api';
import AuthModal from './AuthModal.vue';

export default {
  name: 'NavigationMenu',
  components: {
    AuthModal,
  },
  data() {
    return {
      menuOpen: false,
      userMenuOpen: false,
      authModalVisible: false,
      authModalMode: 'login',
      currentUser: null,
      userRole: null, // 添加响应式的用户角色属性
    };
  },
  computed: {
    isAdmin() {
      // 优先使用响应式的userRole，如果没有则从localStorage读取
      if (this.userRole) {
        return this.userRole === 'admin';
      }
      return authUtils.isAdmin();
    },
  },
  mounted() {
    this.loadUser();
    // 监听localStorage变化（用于跨标签页同步）
    window.addEventListener('storage', this.handleStorageChange);
  },
  beforeDestroy() {
    // 清理事件监听器
    window.removeEventListener('storage', this.handleStorageChange);
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    closeMenu() {
      this.menuOpen = false;
    },
    toggleUserMenu() {
      this.userMenuOpen = !this.userMenuOpen;
    },
    closeUserMenu() {
      this.userMenuOpen = false;
    },
    openAuthModal(mode = 'login') {
      this.authModalMode = mode;
      this.authModalVisible = true;
      this.closeUserMenu();
    },
    closeAuthModal() {
      this.authModalVisible = false;
    },
    handleLoginSuccess(user) {
      this.currentUser = user;
      // 更新响应式的用户角色，触发菜单刷新
      this.userRole = user ? user.role : null;
      this.loadUser();
      // 如果当前在留言板页面，刷新页面以确保状态更新
      if (this.$route.path === '/messages') {
        setTimeout(() => {
          this.$router.go(0);
        }, 500);
      } else {
        // 强制更新组件以确保菜单立即刷新
        this.$nextTick(() => {
          this.$forceUpdate();
        });
      }
    },
    loadUser() {
      const user = authUtils.getUser();
      this.currentUser = user;
      // 同步更新响应式的用户角色
      this.userRole = user ? user.role : null;
    },
    logout() {
      authUtils.clearUser();
      this.currentUser = null;
      this.userRole = null; // 清除响应式的用户角色
      this.closeUserMenu();
      this.showNotification('已退出登录', 'success');
      // 如果当前在用户管理页面，重定向到首页
      if (this.$route.path === '/users') {
        this.$router.push('/');
      }
      // 如果当前在留言板页面，刷新页面以确保状态更新
      else if (this.$route.path === '/messages') {
        setTimeout(() => {
          this.$router.go(0);
        }, 500);
      } else {
        // 强制更新组件以确保菜单立即刷新
        this.$nextTick(() => {
          this.$forceUpdate();
        });
      }
    },
    handleStorageChange(event) {
      // 当localStorage中的user数据变化时，重新加载用户信息
      if (event.key === 'user') {
        this.loadUser();
        this.$forceUpdate();
      }
    },
    getRoleText(role) {
      const texts = {
        user: '普通用户',
        admin: '管理员',
        moderator: '版主',
      };
      return texts[role] || role;
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
        border: 1px solid ${
          type === 'error' ? 'var(--cyber-neon-pink)' : 'var(--cyber-neon-green)'
        };
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
    },
  },
  watch: {
    $route() {
      this.closeMenu();
      this.closeUserMenu();
    },
  },
  directives: {
    'click-outside': {
      bind(el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
          if (!(el === event.target || el.contains(event.target))) {
            vnode.context[binding.expression](event);
          }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
      },
      unbind(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
      },
    },
  },
};
</script>

<style scoped>
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(10, 10, 15, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--cyber-glass-border);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.nav-brand {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 1.5em;
  font-weight: 700;
  letter-spacing: 2px;
  transition: all 0.3s ease;
}

.brand-text {
  transition: all 0.3s ease;
}

.brand-dot {
  margin-left: 4px;
  font-size: 1.2em;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.brand-link:hover .brand-text {
  text-shadow: 0 0 8px var(--cyber-neon-cyan), 0 0 16px var(--cyber-neon-cyan);
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-menu-container {
  position: relative;
}

.user-avatar-btn {
  background: transparent;
  border: 2px solid var(--cyber-neon-cyan);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.user-avatar-btn:hover {
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  transform: scale(1.05);
}

.user-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(0, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cyber-neon-cyan);
  font-weight: 700;
  font-size: 1.1em;
}

.user-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: rgba(10, 10, 15, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid var(--cyber-glass-border);
  border-radius: 8px;
  min-width: 200px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1001;
}

.user-menu.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.user-info {
  padding: 16px;
  border-bottom: 1px solid var(--cyber-glass-border);
}

.user-name {
  font-weight: 600;
  color: var(--cyber-text-primary);
  font-size: 1em;
  margin-bottom: 4px;
}

.user-role {
  font-size: 0.85em;
  color: var(--cyber-neon-cyan);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.user-menu-divider {
  height: 1px;
  background: var(--cyber-glass-border);
  margin: 8px 0;
}

.user-menu-item {
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  color: var(--cyber-text-secondary);
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.95em;
  transition: all 0.3s ease;
}

.user-menu-item:hover {
  background: rgba(0, 255, 255, 0.1);
  color: var(--cyber-neon-cyan);
}

.user-menu-item:first-of-type {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.user-menu-item:last-of-type {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  text-decoration: none;
  color: var(--cyber-text-secondary);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--cyber-neon-cyan);
  transform: translateX(-50%);
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: var(--cyber-text-primary);
  background: rgba(0, 217, 255, 0.05);
}

.nav-link:hover::before {
  width: 80%;
}

.nav-link.active {
  color: var(--cyber-neon-cyan);
  background: rgba(0, 217, 255, 0.1);
}

.nav-link.active::before {
  width: 80%;
}

.nav-link.active .nav-icon {
  transform: scale(1.2);
  filter: drop-shadow(0 0 8px var(--cyber-neon-cyan));
}

.nav-icon {
  font-size: 1.2em;
  transition: all 0.3s ease;
}

.nav-text {
  position: relative;
}

.nav-toggle {
  display: none;
  flex-direction: column;
  gap: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 1001;
}

.toggle-line {
  width: 24px;
  height: 2px;
  background: var(--cyber-neon-cyan);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 4px var(--cyber-neon-cyan);
}

.toggle-line.active:nth-child(1) {
  transform: rotate(45deg) translate(8px, 8px);
}

.toggle-line.active:nth-child(2) {
  opacity: 0;
}

.toggle-line.active:nth-child(3) {
  transform: rotate(-45deg) translate(8px, -8px);
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 16px;
    height: 60px;
  }

  .nav-toggle {
    display: flex;
  }

  .nav-menu {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: rgba(10, 10, 15, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--cyber-glass-border);
    padding: 20px;
    gap: 12px;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }

  .nav-menu.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-link {
    width: 100%;
    justify-content: flex-start;
    padding: 16px 20px;
    border-radius: 8px;
  }

  .brand-link {
    font-size: 1.3em;
  }

  .nav-right {
    gap: 12px;
  }

  .user-avatar-btn {
    width: 36px;
    height: 36px;
  }

  .user-menu {
    right: 0;
    min-width: 180px;
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
</style>
