<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="home-page">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="text-gradient">欢迎来到</span>
          <span class="neon-cyan neon-glow">赛博空间</span>
        </h1>
        <p class="hero-subtitle">
          探索数字世界的无限可能
        </p>
        <div class="hero-actions">
          <router-link to="/about" class="cyber-button">
            了解更多
          </router-link>
          <router-link to="/messages" class="cyber-button" style="border-color: var(--cyber-neon-pink); color: var(--cyber-neon-pink);">
            留言互动
          </router-link>
          <router-link to="/entertainment" class="cyber-button" style="border-color: var(--cyber-neon-purple); color: var(--cyber-neon-purple);">
            娱乐游戏
          </router-link>
        </div>
      </div>
      
      <div class="hero-visual">
        <div class="cyber-grid">
          <div 
            class="grid-item" 
            v-for="i in 9" 
            :key="i"
            :style="{ backgroundImage: `url(${require(`@/assets/grid/grid-part-${i}.png`)})` }"
          ></div>
        </div>
      </div>
    </div>
    
    <div class="features-section">
      <div class="cyber-card feature-card">
        <div class="feature-icon neon-cyan">⚡</div>
        <h3 class="feature-title">个人介绍</h3>
        <p class="feature-desc">了解我的技能、经历和理念</p>
        <router-link to="/about" class="feature-link">
          查看详情 →
        </router-link>
      </div>
      
      <div class="cyber-card feature-card">
        <div class="feature-icon neon-pink">✉</div>
        <h3 class="feature-title">留言互动</h3>
        <p class="feature-desc">留下您的足迹，与我交流互动</p>
        <router-link to="/messages" class="feature-link">
          前往留言 →
        </router-link>
      </div>
      
      <div class="cyber-card feature-card">
        <div class="feature-icon neon-purple">🎮</div>
        <h3 class="feature-title">娱乐游戏</h3>
        <p class="feature-desc">放松心情，享受游戏时光</p>
        <router-link to="/entertainment" class="feature-link">
          开始游戏 →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
.home-page {
  min-height: calc(100vh - 70px);
  padding: 80px 20px 40px;
  position: relative;
  z-index: 10;
}

.hero-section {
  max-width: 1200px;
  margin: 0 auto 80px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-content {
  animation: fadeInUp 0.8s ease-out;
}

.hero-title {
  font-size: 4.5em;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 24px;
  letter-spacing: -1px;
}

.hero-subtitle {
  font-size: 1.3em;
  color: var(--cyber-text-secondary);
  margin-bottom: 40px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.hero-visual {
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cyber-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 400px;
}

.grid-item {
  aspect-ratio: 1;
  background: var(--cyber-glass);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid var(--cyber-glass-border);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  animation: float 3s ease-in-out infinite;
}

.grid-item:nth-child(1) { animation-delay: 0s; }
.grid-item:nth-child(2) { animation-delay: 0.2s; }
.grid-item:nth-child(3) { animation-delay: 0.4s; }
.grid-item:nth-child(4) { animation-delay: 0.6s; }
.grid-item:nth-child(5) { animation-delay: 0.8s; }
.grid-item:nth-child(6) { animation-delay: 1s; }
.grid-item:nth-child(7) { animation-delay: 1.2s; }
.grid-item:nth-child(8) { animation-delay: 1.4s; }
.grid-item:nth-child(9) { animation-delay: 1.6s; }

.grid-item::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(0, 217, 255, 0.1),
    transparent
  );
  animation: rotate 4s linear infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
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

.features-section {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature-card {
  text-align: center;
  transition: all 0.4s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
}

.feature-icon {
  font-size: 4em;
  margin-bottom: 20px;
  display: inline-block;
  filter: drop-shadow(0 0 20px currentColor);
}

.feature-title {
  font-size: 1.8em;
  margin-bottom: 12px;
  color: var(--cyber-text-primary);
  font-weight: 600;
}

.feature-desc {
  color: var(--cyber-text-secondary);
  margin-bottom: 24px;
  line-height: 1.6;
}

.feature-link {
  color: var(--cyber-neon-cyan);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-block;
}

.feature-link:hover {
  color: var(--cyber-neon-pink);
  transform: translateX(5px);
}

@media (max-width: 968px) {
  .hero-section {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .hero-title {
    font-size: 3em;
  }
  
  .hero-visual {
    height: 300px;
  }
  
  .hero-actions {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .home-page {
    padding: 60px 16px 30px;
  }
  
  .hero-title {
    font-size: 2.5em;
  }
  
  .hero-subtitle {
    font-size: 1.1em;
  }
  
  .features-section {
    grid-template-columns: 1fr;
  }
}
</style>

