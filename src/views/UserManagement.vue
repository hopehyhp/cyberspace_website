<template>
  <div class="user-management-page">
    <div class="page-header">
      <h1 class="page-title">
        <span class="neon-pink neon-glow">用户管理</span>
      </h1>
      <p class="page-subtitle">管理系统用户信息</p>
    </div>

    <div class="management-container">
      <!-- 用户列表 -->
      <div class="users-section">
        <div class="users-header">
          <h3 class="users-title neon-green">用户列表</h3>
          <div class="users-header-right">
            <div class="user-count">
              共 {{ users.length }} 个用户
            </div>
            <button
              class="cyber-button add-user-btn"
              @click="openAddUserModal"
            >
              <span class="btn-icon">+</span>
              新增用户
            </button>
          </div>
        </div>

        <div class="users-table-container">
          <table class="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>用户名</th>
                <th>邮箱</th>
                <th>手机号</th>
                <th>状态</th>
                <th>角色</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id" class="user-row">
                <td>{{ user.id }}</td>
                <td class="username-cell">{{ user.username }}</td>
                <td>{{ user.email || '-' }}</td>
                <td>{{ user.phone || '-' }}</td>
                <td>
                  <span :class="getStatusClass(user.status)">
                    {{ getStatusText(user.status) }}
                  </span>
                </td>
                <td>
                  <span :class="getRoleClass(user.role)">
                    {{ getRoleText(user.role) }}
                  </span>
                </td>
                <td>{{ formatDate(user.created_at) }}</td>
                <td class="actions-cell">
                  <button
                    class="action-btn edit-btn"
                    @click="editUser(user)"
                    title="编辑"
                  >
                    编辑
                  </button>
                  <button
                    class="action-btn delete-btn"
                    @click="confirmDelete(user)"
                    title="删除"
                  >
                    删除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="users.length === 0" class="empty-state cyber-card">
            <div class="empty-icon neon-purple">[暂无用户]</div>
            <div class="empty-text">创建第一个用户吧！</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户表单模态框 -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container cyber-card">
        <div class="modal-header">
          <h3 class="modal-title neon-cyan">
            {{ editingUser ? '编辑用户' : '添加新用户' }}
          </h3>
          <button class="modal-close-btn" @click="closeModal" title="关闭">
            ×
          </button>
        </div>
        <div class="modal-body">
          <div class="user-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label neon-cyan">用户名 *</label>
                <input
                  type="text"
                  class="cyber-input"
                  v-model="userForm.username"
                  placeholder="输入用户名..."
                  maxlength="50"
                  :disabled="editingUser"
                />
              </div>

              <div class="form-group">
                <label class="form-label neon-cyan">
                  {{ editingUser ? '密码' : '密码 *' }}
                </label>
                <input
                  type="password"
                  class="cyber-input"
                  v-model="userForm.password"
                  :placeholder="editingUser ? '输入新密码以修改（留空则不修改，至少6位）...' : '输入密码（至少6位）...'"
                  minlength="6"
                />
                <div v-if="editingUser" class="password-hint">
                  <span class="hint-text">提示：密码以加密形式存储，无法查看原密码。输入新密码即可修改。</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label neon-cyan">邮箱</label>
                <input
                  type="email"
                  class="cyber-input"
                  v-model="userForm.email"
                  placeholder="输入邮箱..."
                />
              </div>

              <div class="form-group">
                <label class="form-label neon-cyan">手机号</label>
                <input
                  type="text"
                  class="cyber-input"
                  v-model="userForm.phone"
                  placeholder="输入手机号..."
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label neon-cyan">状态</label>
                <select class="cyber-input" v-model="userForm.status">
                  <option value="active">活跃</option>
                  <option value="inactive">非活跃</option>
                  <option value="banned">已禁用</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label neon-cyan">角色</label>
                <select class="cyber-input" v-model="userForm.role">
                  <option value="user">用户</option>
                  <option value="admin">管理员</option>
                  <option value="moderator">版主</option>
                </select>
              </div>
            </div>

            <div class="form-actions">
              <button
                class="cyber-button"
                @click="submitUser"
                :disabled="!canSubmit"
              >
                <span v-if="loading">{{ editingUser ? '更新中...' : '创建中...' }}</span>
                <span v-else-if="!canSubmit">{{ getSubmitButtonText() }}</span>
                <span v-else>{{ editingUser ? '更新用户' : '创建用户' }}</span>
              </button>
              <button
                class="cyber-button cancel-button"
                @click="closeModal"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userAPI, authUtils } from '../utils/api';

export default {
  name: 'UserManagement',
  data() {
    return {
      users: [],
      loading: false,
      editingUser: null,
      showModal: false,
      userForm: {
        username: '',
        password: '',
        email: '',
        phone: '',
        status: 'active',
        role: 'user'
      }
    };
  },
  computed: {
    canSubmit() {
      if (this.editingUser) {
        // 编辑时，需要用户名；如果提供了密码，则密码至少6位
        const passwordValid = !this.userForm.password || this.userForm.password.length >= 6;
        return this.userForm.username.trim() !== '' && passwordValid && !this.loading;
      } else {
        // 创建时，需要用户名和密码
        return this.userForm.username.trim() !== '' && 
               this.userForm.password.length >= 6 && 
               !this.loading;
      }
    }
  },
  mounted() {
    // 检查管理员权限
    if (!authUtils.isAdmin()) {
      this.$router.push('/');
      this.showNotification('您没有权限访问此页面', 'error');
      return;
    }
    this.loadUsers();
  },
  methods: {
    async loadUsers() {
      try {
        this.loading = true;
        const response = await userAPI.getUsers();

        if (response.success && response.data) {
          this.users = response.data;
        }
      } catch (error) {
        console.error('加载用户列表失败:', error);
        this.showNotification('加载用户列表失败，请稍后重试', 'error');
      } finally {
        this.loading = false;
      }
    },

    async submitUser() {
      if (!this.canSubmit) return;

      try {
        this.loading = true;
        let response;

        if (this.editingUser) {
          // 更新用户（不包含密码，除非用户提供了新密码）
          const updateData = { ...this.userForm };
          if (!updateData.password || updateData.password.trim() === '') {
            delete updateData.password; // 如果没有提供密码，则不更新密码
          }
          response = await userAPI.updateUser(this.editingUser.id, updateData);
        } else {
          // 创建用户
          response = await userAPI.createUser(this.userForm);
        }

        if (response.success) {
          this.showNotification(response.message || (this.editingUser ? '用户更新成功！' : '用户创建成功！'));
          this.closeModal();
          this.loadUsers();
        }
      } catch (error) {
        console.error('提交用户失败:', error);
        this.showNotification(error.message || '操作失败，请稍后重试', 'error');
      } finally {
        this.loading = false;
      }
    },

    openAddUserModal() {
      this.resetForm();
      this.showModal = true;
    },

    editUser(user) {
      this.editingUser = user;
      this.userForm = {
        username: user.username,
        password: '', // 编辑时密码留空，输入新密码才会更新
        email: user.email || '',
        phone: user.phone || '',
        status: user.status,
        role: user.role
      };
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      // 延迟重置表单，等待模态框关闭动画完成
      setTimeout(() => {
        if (!this.showModal) {
          this.resetForm();
        }
      }, 300);
    },

    getSubmitButtonText() {
      if (!this.userForm.username.trim()) {
        return '请填写用户名';
      }
      if (this.editingUser) {
        if (this.userForm.password && this.userForm.password.length > 0 && this.userForm.password.length < 6) {
          return '密码至少6位';
        }
      } else {
        if (!this.userForm.password || this.userForm.password.length < 6) {
          return '请填写密码（至少6位）';
        }
      }
      return this.editingUser ? '更新用户' : '创建用户';
    },

    resetForm() {
      this.editingUser = null;
      this.userForm = {
        username: '',
        password: '',
        email: '',
        phone: '',
        status: 'active',
        role: 'user'
      };
    },

    confirmDelete(user) {
      if (confirm(`确定要删除用户 "${user.username}" 吗？此操作不可恢复。`)) {
        this.deleteUser(user.id);
      }
    },

    async deleteUser(userId) {
      try {
        this.loading = true;
        const response = await userAPI.deleteUser(userId);

        if (response.success) {
          this.showNotification('用户删除成功！');
          this.loadUsers();
        }
      } catch (error) {
        console.error('删除用户失败:', error);
        this.showNotification(error.message || '删除用户失败，请稍后重试', 'error');
      } finally {
        this.loading = false;
      }
    },

    getStatusClass(status) {
      const classes = {
        active: 'status-badge status-active',
        inactive: 'status-badge status-inactive',
        banned: 'status-badge status-banned'
      };
      return classes[status] || 'status-badge';
    },

    getStatusText(status) {
      const texts = {
        active: '活跃',
        inactive: '非活跃',
        banned: '已禁用'
      };
      return texts[status] || status;
    },

    getRoleClass(role) {
      const classes = {
        user: 'role-badge role-user',
        admin: 'role-badge role-admin',
        moderator: 'role-badge role-moderator'
      };
      return classes[role] || 'role-badge';
    },

    getRoleText(role) {
      const texts = {
        user: '用户',
        admin: '管理员',
        moderator: '版主'
      };
      return texts[role] || role;
    },

    formatDate(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
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
};
</script>

<style scoped>
.user-management-page {
  min-height: calc(100vh - 70px);
  padding: 100px 20px 60px;
  position: relative;
  z-index: 10;
  max-width: 1400px;
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

.management-container {
  animation: fadeInUp 0.8s ease-out 0.2s backwards;
}

.users-header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.add-user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 0.95em;
}

.btn-icon {
  font-size: 1.2em;
  font-weight: bold;
  line-height: 1;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease;
  padding: 20px;
}

.modal-container {
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease;
  border: 2px solid var(--cyber-neon-cyan);
  box-shadow: 0 0 40px rgba(0, 255, 255, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 30px;
  border-bottom: 1px solid var(--cyber-glass-border);
}

.modal-title {
  font-size: 1.8em;
  font-weight: 600;
  margin: 0;
}

.modal-close-btn {
  background: transparent;
  border: 1px solid var(--cyber-neon-pink);
  color: var(--cyber-neon-pink);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  padding: 0;
}

.modal-close-btn:hover {
  background: rgba(255, 0, 128, 0.2);
  box-shadow: 0 0 15px rgba(255, 0, 128, 0.4);
  transform: rotate(90deg);
}

.modal-body {
  padding: 30px;
}

.form-title {
  font-size: 1.8em;
  margin-bottom: 30px;
  font-weight: 600;
  text-align: center;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
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

.cyber-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.password-hint {
  margin-top: 6px;
}

.hint-text {
  font-size: 0.85em;
  color: var(--cyber-text-secondary);
  opacity: 0.8;
  font-style: italic;
  line-height: 1.4;
}

.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 10px;
}

.cancel-button {
  background: transparent;
  border-color: var(--cyber-neon-pink);
  color: var(--cyber-neon-pink);
}

.cancel-button:hover {
  background: rgba(255, 0, 128, 0.1);
}

.users-section {
  margin-top: 50px;
}

.users-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--cyber-glass-border);
}

.users-title {
  font-size: 2em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.user-count {
  color: var(--cyber-text-secondary);
  font-size: 0.95em;
  letter-spacing: 1px;
}

.users-table-container {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(10, 10, 15, 0.4);
  border-radius: 8px;
  overflow: hidden;
}

.users-table thead {
  background: rgba(0, 255, 255, 0.1);
  border-bottom: 2px solid var(--cyber-neon-cyan);
}

.users-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: var(--cyber-neon-cyan);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9em;
}

.users-table td {
  padding: 16px;
  border-bottom: 1px solid var(--cyber-glass-border);
  color: var(--cyber-text-secondary);
}

.user-row {
  transition: all 0.3s ease;
}

.user-row:hover {
  background: rgba(0, 255, 255, 0.05);
}

.username-cell {
  font-weight: 600;
  color: var(--cyber-text-primary);
}

.status-badge,
.role-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-active {
  background: rgba(0, 255, 0, 0.2);
  color: var(--cyber-neon-green);
  border: 1px solid var(--cyber-neon-green);
}

.status-inactive {
  background: rgba(255, 255, 0, 0.2);
  color: #ffaa00;
  border: 1px solid #ffaa00;
}

.status-banned {
  background: rgba(255, 0, 128, 0.2);
  color: var(--cyber-neon-pink);
  border: 1px solid var(--cyber-neon-pink);
}

.role-user {
  background: rgba(0, 255, 255, 0.2);
  color: var(--cyber-neon-cyan);
  border: 1px solid var(--cyber-neon-cyan);
}

.role-admin {
  background: rgba(255, 0, 128, 0.2);
  color: var(--cyber-neon-pink);
  border: 1px solid var(--cyber-neon-pink);
}

.role-moderator {
  background: rgba(128, 0, 255, 0.2);
  color: #aa00ff;
  border: 1px solid #aa00ff;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9em;
  font-weight: 500;
  transition: all 0.3s ease;
}

.edit-btn {
  color: var(--cyber-neon-cyan);
  border-color: var(--cyber-neon-cyan);
}

.edit-btn:hover {
  background: rgba(0, 255, 255, 0.1);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

.delete-btn {
  color: var(--cyber-neon-pink);
  border-color: var(--cyber-neon-pink);
}

.delete-btn:hover {
  background: rgba(255, 0, 128, 0.1);
  box-shadow: 0 0 10px rgba(255, 0, 128, 0.3);
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
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .user-management-page {
    padding: 80px 16px 40px;
  }

  .page-title {
    font-size: 2.5em;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .users-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .users-header-right {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .modal-container {
    max-width: 95%;
    max-height: 95vh;
  }

  .modal-header {
    padding: 20px;
  }

  .modal-body {
    padding: 20px;
  }

  .users-table {
    font-size: 0.85em;
  }

  .users-table th,
  .users-table td {
    padding: 10px 8px;
  }

  .actions-cell {
    flex-direction: column;
  }
}
</style>

