<template>
  <div class="entertainment-page">
    <div class="page-header">
      <h1 class="page-title">
        <span class="neon-purple neon-glow">娱乐分区</span>
      </h1>
      <p class="page-subtitle">放松心情，享受游戏时光</p>
    </div>
    
    <div class="games-section">
      <div class="games-grid">
        <div 
          class="cyber-card game-card"
          @click="navigateToGame('gomoku3x3')"
        >
          <div class="game-icon neon-cyan">⚫</div>
          <h3 class="game-title">3x3 五子棋</h3>
          <p class="game-desc">经典五子棋的迷你版本，在3x3的棋盘上挑战你的策略思维</p>
          <div class="game-badge neon-green">NEW</div>
        </div>
        
        <div 
          class="cyber-card game-card"
          @click="navigateToGame('guess-number')"
        >
          <div class="game-icon neon-purple">🔢</div>
          <h3 class="game-title">猜数字</h3>
          <p class="game-desc">在1-100之间猜一个数字，考验你的逻辑推理能力</p>
          <div class="game-badge neon-green">NEW</div>
        </div>
        
        <div 
          class="cyber-card game-card"
          @click="navigateToGame('tetris')"
        >
          <div class="game-icon neon-cyan">🧩</div>
          <h3 class="game-title">俄罗斯方块</h3>
          <p class="game-desc">经典消除游戏，挑战你的反应速度和策略思维</p>
          <div class="game-badge neon-green">NEW</div>
        </div>
        
        <div 
          class="cyber-card game-card"
          @click="navigateToGame('guess-idiom')"
        >
          <div class="game-icon neon-purple">📝</div>
          <h3 class="game-title">猜成语</h3>
          <p class="game-desc">通过拼音和颜色提示，猜出4字成语，考验你的中文水平</p>
          <div class="game-badge neon-green">NEW</div>
        </div>
        
        <!-- 预留更多游戏位置 -->
        <div class="cyber-card game-card coming-soon">
          <div class="game-icon neon-purple">🎮</div>
          <h3 class="game-title">更多游戏</h3>
          <p class="game-desc">敬请期待...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EntertainmentPage',
  methods: {
    navigateToGame(gameName) {
      this.$router.push(`/entertainment/${gameName}`)
    }
  }
}
</script>

<style scoped>
.entertainment-page {
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

.games-section {
  animation: fadeInUp 0.8s ease-out 0.2s backwards;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.game-card {
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

.game-card > * {
  position: relative;
  z-index: 2;
  pointer-events: none;
}

.game-card:not(.coming-soon):hover {
  transform: translateY(-8px) scale(1.02);
  border-color: var(--cyber-neon-cyan);
  box-shadow: 
    var(--cyber-shadow-lg),
    0 0 30px rgba(0, 217, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  cursor: pointer !important;
}

.game-card:not(.coming-soon):active {
  transform: translateY(-4px) scale(1.01);
  transition: transform 0.1s ease;
}

.game-card.coming-soon {
  opacity: 0.5;
  cursor: not-allowed;
}

.game-icon {
  font-size: 4.5em;
  margin-bottom: 20px;
  display: inline-block;
  filter: drop-shadow(0 0 20px currentColor);
  transition: transform 0.3s ease;
}

.game-card:not(.coming-soon):hover .game-icon {
  transform: scale(1.1) rotate(5deg);
}

.game-title {
  font-size: 1.8em;
  margin-bottom: 12px;
  color: var(--cyber-text-primary);
  font-weight: 600;
}

.game-desc {
  color: var(--cyber-text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
}

.game-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 6px 12px;
  font-size: 0.75em;
  font-weight: 600;
  letter-spacing: 1px;
  border: 1px solid var(--cyber-neon-green);
  border-radius: 4px;
  background: rgba(0, 255, 136, 0.1);
  text-transform: uppercase;
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
  .entertainment-page {
    padding: 20px 16px 40px;
  }
  
  .page-title {
    font-size: 2.5em;
  }
  
  .games-grid {
    grid-template-columns: 1fr;
  }
}
</style>

