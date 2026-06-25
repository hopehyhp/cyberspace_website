<template>
  <div class="tech-sharing-page">
    <div class="page-header">
      <h1 class="page-title">
        <span class="neon-cyan neon-glow">技术分享</span>
      </h1>
      <p class="page-subtitle">记录技术心得，分享实用经验</p>
    </div>

    <div class="modules-section">
      <div class="modules-grid">
        <div class="cyber-card module-card" @click="navigateToSub('common-questions')">
          <div class="module-icon neon-purple">❓</div>
          <h3 class="module-title">常见问题解析</h3>
          <p class="module-desc">梳理开发中经常遇到的问题，提供清晰的分析与解决方案</p>
        </div>

        <div class="cyber-card module-card" @click="navigateToSub('common-methods')">
          <div class="module-icon neon-cyan">💡</div>
          <h3 class="module-title">常见方法举例</h3>
          <p class="module-desc">汇总实用技巧与代码示例，帮助快速上手常见开发场景</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TechSharingPage',
  methods: {
    navigateToSub(subName) {
      this.$router.push(`/tech-sharing/${subName}`);
    },
  },
};
</script>

<style scoped>
.tech-sharing-page {
  min-height: calc(100vh - 70px);
  padding: 20px 20px 60px;
  position: relative;
  z-index: 10;
  max-width: 1200px;
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

.modules-section {
  animation: fadeInUp 0.8s ease-out 0.2s backwards;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.module-card {
  position: relative;
  cursor: pointer !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  overflow: visible;
  user-select: none;
  -webkit-user-select: none;
  pointer-events: auto !important;
  z-index: 1;
}

.module-card > * {
  position: relative;
  z-index: 2;
  pointer-events: none;
}

.module-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: var(--cyber-neon-cyan);
  box-shadow: var(--cyber-shadow-lg), 0 0 30px rgba(0, 217, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.module-card:active {
  transform: translateY(-4px) scale(1.01);
  transition: transform 0.1s ease;
}

.module-icon {
  font-size: 4.5em;
  margin-bottom: 20px;
  display: inline-block;
  filter: drop-shadow(0 0 20px currentColor);
  transition: transform 0.3s ease;
}

.module-card:hover .module-icon {
  transform: scale(1.1) rotate(5deg);
}

.module-title {
  font-size: 1.8em;
  margin-bottom: 12px;
  color: var(--cyber-text-primary);
  font-weight: 600;
}

.module-desc {
  color: var(--cyber-text-secondary);
  line-height: 1.6;
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
  .tech-sharing-page {
    padding: 20px 16px 40px;
  }

  .page-title {
    font-size: 2.5em;
  }

  .modules-grid {
    grid-template-columns: 1fr;
  }
}
</style>
