<template>
  <div class="gomoku-page">
    <div class="game-header">
      <button class="back-button" @click="goBack">
        <span class="back-icon">←</span>
        <span>返回娱乐分区</span>
      </button>
      <h1 class="game-title">
        <span class="neon-cyan neon-glow">3x3 五子棋</span>
      </h1>
    </div>
    
    <div class="game-container">
      <div class="cyber-card game-board-card">
        <div class="game-info">
          <div class="current-player">
            <span class="info-label">当前玩家:</span>
            <span 
              class="player-name"
              :class="currentPlayer === 'X' ? 'neon-cyan' : 'neon-pink'"
            >
              {{ currentPlayer === 'X' ? '玩家 X' : '玩家 O' }}
            </span>
          </div>
          <div class="game-status">
            <span 
              class="status-text"
              :class="{
                'neon-green': gameStatus === 'playing',
                'neon-yellow': gameStatus === 'draw',
                'neon-pink': gameStatus === 'win'
              }"
            >
              {{ statusMessage }}
            </span>
          </div>
        </div>
        
        <div class="board-container">
          <div class="game-board">
            <div
              v-for="(cell, index) in board"
              :key="index"
              class="cell"
              :class="{
                'cell-x': cell === 'X',
                'cell-o': cell === 'O',
                'cell-winner': winningCells.includes(index)
              }"
              @click="makeMove(index)"
            >
              <span v-if="cell === 'X'" class="mark-x">✕</span>
              <span v-else-if="cell === 'O'" class="mark-o">○</span>
            </div>
          </div>
        </div>
        
        <div class="game-controls">
          <button 
            class="cyber-button reset-button"
            @click="resetGame"
            :disabled="gameStatus === 'playing' && movesCount === 0"
          >
            重新开始
          </button>
        </div>
      </div>
      
      <div class="cyber-card game-rules-card">
        <h3 class="rules-title neon-purple">游戏规则</h3>
        <ul class="rules-list">
          <li>在3x3的棋盘上，两名玩家轮流下棋</li>
          <li>玩家X使用 ✕ 标记，玩家O使用 ○ 标记</li>
          <li>率先在横、竖或对角线上连成3子的玩家获胜</li>
          <li>如果棋盘填满且无人获胜，则为平局</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Gomoku3x3Game',
  data() {
    return {
      board: Array(9).fill(null),
      currentPlayer: 'X',
      gameStatus: 'playing', // 'playing', 'win', 'draw'
      winningCells: [],
      movesCount: 0
    }
  },
  computed: {
    statusMessage() {
      if (this.gameStatus === 'win') {
        return `${this.currentPlayer === 'X' ? '玩家 O' : '玩家 X'} 获胜！`
      } else if (this.gameStatus === 'draw') {
        return '平局！'
      } else {
        return '游戏进行中...'
      }
    }
  },
  methods: {
    makeMove(index) {
      // 如果游戏已结束或该位置已有棋子，则不允许下棋
      if (this.board[index] || this.gameStatus !== 'playing') {
        return
      }
      
      // 下棋
      this.$set(this.board, index, this.currentPlayer)
      this.movesCount++
      
      // 检查是否获胜
      if (this.checkWin()) {
        this.gameStatus = 'win'
        this.showNotification(`${this.currentPlayer === 'X' ? '玩家 X' : '玩家 O'} 获胜！`)
        return
      }
      
      // 检查是否平局
      if (this.movesCount === 9) {
        this.gameStatus = 'draw'
        this.showNotification('平局！')
        return
      }
      
      // 切换玩家
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X'
    },
    
    checkWin() {
      const winPatterns = [
        [0, 1, 2], // 第一行
        [3, 4, 5], // 第二行
        [6, 7, 8], // 第三行
        [0, 3, 6], // 第一列
        [1, 4, 7], // 第二列
        [2, 5, 8], // 第三列
        [0, 4, 8], // 主对角线
        [2, 4, 6]  // 副对角线
      ]
      
      for (const pattern of winPatterns) {
        const [a, b, c] = pattern
        if (
          this.board[a] &&
          this.board[a] === this.board[b] &&
          this.board[a] === this.board[c]
        ) {
          this.winningCells = pattern
          return true
        }
      }
      
      return false
    },
    
    resetGame() {
      this.board = Array(9).fill(null)
      this.currentPlayer = 'X'
      this.gameStatus = 'playing'
      this.winningCells = []
      this.movesCount = 0
    },
    
    goBack() {
      this.$router.push('/entertainment')
    },
    
    showNotification(text) {
      const notification = document.createElement('div')
      notification.className = 'game-notification'
      notification.textContent = text
      notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 24px 40px;
        background: rgba(10, 10, 15, 0.98);
        backdrop-filter: blur(20px);
        border: 2px solid var(--cyber-neon-cyan);
        border-radius: 12px;
        z-index: 10000;
        font-size: 1.5em;
        font-weight: 600;
        color: var(--cyber-neon-cyan);
        text-shadow: 0 0 10px var(--cyber-neon-cyan);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 217, 255, 0.3);
        animation: notificationPop 0.4s ease-out;
      `
      document.body.appendChild(notification)
      
      setTimeout(() => {
        notification.style.animation = 'notificationFadeOut 0.3s ease-out'
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification)
          }
        }, 300)
      }, 2000)
    }
  }
}
</script>

<style scoped>
.gomoku-page {
  min-height: calc(100vh - 70px);
  padding: 100px 20px 60px;
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
}

.game-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  padding-top: 0;
  animation: fadeInDown 0.6s ease-out;
}

.back-button {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(0, 217, 255, 0.1);
  border: 1px solid var(--cyber-neon-cyan);
  color: var(--cyber-neon-cyan);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.3s ease;
  font-family: 'Orbitron', monospace;
  z-index: 1;
}

.back-button:hover {
  background: rgba(0, 217, 255, 0.2);
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.4);
  transform: translateY(-50%) translateX(-3px);
}

.back-icon {
  font-size: 1.2em;
}

.game-title {
  font-size: 3.5em;
  font-weight: 800;
  margin: 0;
  letter-spacing: 2px;
  text-align: center;
  flex: 1;
}

.game-container {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 30px;
  animation: fadeInUp 0.8s ease-out 0.2s backwards;
}

.game-board-card {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.game-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--cyber-glass-border);
}

.info-label {
  color: var(--cyber-text-secondary);
  margin-right: 10px;
}

.player-name {
  font-weight: 600;
  font-size: 1.2em;
}

.status-text {
  font-weight: 600;
  font-size: 1.1em;
}

.board-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.game-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 4px;
  background: var(--cyber-glass-border);
  padding: 4px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1;
}

.cell {
  background: rgba(10, 10, 15, 0.8);
  border: 1px solid var(--cyber-glass-border);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.cell::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(0, 217, 255, 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease;
}

.cell:hover::before {
  width: 100%;
  height: 100%;
}

.cell:hover {
  border-color: var(--cyber-neon-cyan);
  background: rgba(0, 217, 255, 0.05);
  transform: scale(1.05);
}

.cell-x {
  border-color: var(--cyber-neon-cyan);
  background: rgba(0, 217, 255, 0.1);
}

.cell-o {
  border-color: var(--cyber-neon-pink);
  background: rgba(255, 0, 128, 0.1);
}

.cell-winner {
  animation: winnerPulse 0.6s ease-in-out 3;
  border-color: var(--cyber-neon-green);
  background: rgba(0, 255, 136, 0.2);
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
}

.mark-x {
  font-size: 4em;
  color: var(--cyber-neon-cyan);
  font-weight: 300;
  text-shadow: 
    0 0 10px var(--cyber-neon-cyan),
    0 0 20px var(--cyber-neon-cyan);
  line-height: 1;
}

.mark-o {
  font-size: 4em;
  color: var(--cyber-neon-pink);
  font-weight: 300;
  text-shadow: 
    0 0 10px var(--cyber-neon-pink),
    0 0 20px var(--cyber-neon-pink);
  line-height: 1;
}

.game-controls {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid var(--cyber-glass-border);
}

.reset-button {
  min-width: 150px;
}

.game-rules-card {
  height: fit-content;
}

.rules-title {
  font-size: 1.5em;
  margin-bottom: 20px;
  font-weight: 600;
  text-align: center;
}

.rules-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.rules-list li {
  padding: 12px 0;
  color: var(--cyber-text-secondary);
  line-height: 1.8;
  border-bottom: 1px solid var(--cyber-glass-border);
  position: relative;
  padding-left: 24px;
}

.rules-list li:last-child {
  border-bottom: none;
}

.rules-list li::before {
  content: '▶';
  position: absolute;
  left: 0;
  color: var(--cyber-neon-purple);
  font-size: 0.8em;
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

@keyframes winnerPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(0, 255, 136, 0.6);
  }
}

@keyframes notificationPop {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes notificationFadeOut {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
}

@media (max-width: 968px) {
  .game-container {
    grid-template-columns: 1fr;
  }
  
  .game-rules-card {
    order: -1;
  }
}

@media (max-width: 768px) {
  .gomoku-page {
    padding: 80px 16px 40px;
  }

  .back-button {
    position: relative;
    left: 0;
    top: 0;
    transform: none;
    margin-bottom: 20px;
  }
  
  .back-button:hover {
    transform: translateX(-3px);
  }
  
  .game-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .game-title {
    width: 100%;
    margin-top: 20px;
  }
  
  .game-title {
    font-size: 2.5em;
  }
  
  .game-board {
    max-width: 100%;
  }
  
  .mark-x,
  .mark-o {
    font-size: 3em;
  }
  
  .game-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>

