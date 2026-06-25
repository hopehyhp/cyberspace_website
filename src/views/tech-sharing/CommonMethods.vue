<template>
  <div class="common-methods-page">
    <div class="page-header">
      <button class="back-button" @click="goBack">
        <span class="back-icon">←</span>
        <span>返回技术分享</span>
      </button>
      <h1 class="page-title">
        <span class="neon-cyan neon-glow">常见方法举例</span>
      </h1>
    </div>

    <div class="content-section">
      <div class="cyber-card content-card">
        <div class="placeholder-icon neon-purple">🔧</div>
        <p class="placeholder-text">内容筹备中，敬请期待...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommonMethodsPage',
  methods: {
    goBack() {
      this.$router.push('/tech-sharing');
    },
  },
};
</script>

<style scoped>
.common-methods-page {
  min-height: calc(100vh - 70px);
  padding: 20px 20px 60px;
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 40px;
  animation: fadeInDown 0.6s ease-out;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  margin-bottom: 24px;
  background: rgba(0, 217, 255, 0.05);
  border: 1px solid var(--cyber-glass-border);
  border-radius: 8px;
  color: var(--cyber-text-secondary);
  font-family: inherit;
  font-size: 0.95em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  color: var(--cyber-neon-cyan);
  border-color: var(--cyber-neon-cyan);
  background: rgba(0, 217, 255, 0.1);
}

.back-icon {
  font-size: 1.2em;
}

.page-title {
  font-size: 2.8em;
  font-weight: 800;
  letter-spacing: 2px;
}

.content-section {
  animation: fadeInUp 0.8s ease-out 0.2s backwards;
}

.content-card {
  text-align: center;
  padding: 80px 40px;
}

.placeholder-icon {
  font-size: 4em;
  margin-bottom: 24px;
  display: inline-block;
  filter: drop-shadow(0 0 20px currentColor);
}

.placeholder-text {
  color: var(--cyber-text-secondary);
  font-size: 1.2em;
  letter-spacing: 1px;
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

@media (max-width: 768px) {
  .common-methods-page {
    padding: 20px 16px 40px;
  }

  .page-title {
    font-size: 2em;
  }

  .content-card {
    padding: 60px 24px;
  }
}
</style>
