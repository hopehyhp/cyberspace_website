<template>
  <div class="guess-number-page">
    <div class="game-header">
      <button class="back-button" @click="goBack">
        <span class="back-icon">←</span>
        <span>返回娱乐分区</span>
      </button>
      <h1 class="game-title">
        <span class="neon-purple neon-glow">猜数字</span>
      </h1>
    </div>
    
    <div class="game-container">
      <div class="cyber-card game-card">
        <div class="game-info">
          <div class="info-item">
            <span class="info-label">目标范围:</span>
            <span class="info-value neon-cyan">1 - {{ maxNumber }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">剩余次数:</span>
            <span 
              class="info-value"
              :class="{
                'neon-green': attemptsLeft > 5,
                'neon-yellow': attemptsLeft > 2 && attemptsLeft <= 5,
                'neon-pink': attemptsLeft <= 2
              }"
            >
              {{ attemptsLeft }}
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">游戏状态:</span>
            <span 
              class="info-value"
              :class="{
                'neon-green': gameStatus === 'playing',
                'neon-yellow': gameStatus === 'won',
                'neon-pink': gameStatus === 'lost'
              }"
            >
              {{ statusMessage }}
            </span>
          </div>
        </div>

        <div class="game-area">
          <div v-if="gameStatus === 'playing'" class="input-section">
            <div class="hint-display">
              <div v-if="lastHint" class="hint-text" :class="hintClass">
                {{ lastHint }}
              </div>
            </div>
            
            <div class="guess-input-wrapper">
              <input
                v-model.number="currentGuess"
                type="number"
                :min="1"
                :max="maxNumber"
                class="guess-input"
                placeholder="输入你的猜测..."
                @keyup.enter="makeGuess"
                :disabled="gameStatus !== 'playing'"
              />
              <button 
                class="guess-button"
                @click="makeGuess"
                :disabled="gameStatus !== 'playing' || !currentGuess"
              >
                猜！
              </button>
            </div>
          </div>

          <div v-else class="result-section">
            <div class="result-message" :class="resultClass">
              <div class="result-icon">{{ resultIcon }}</div>
              <div class="result-text">{{ resultMessage }}</div>
              <div v-if="gameStatus === 'won'" class="result-detail">
                你用了 {{ maxAttempts - attemptsLeft }} 次猜中了数字！
              </div>
              <div v-else-if="gameStatus === 'lost'" class="result-detail">
                正确答案是: <span class="neon-cyan">{{ targetNumber }}</span>
              </div>
            </div>
          </div>

          <div class="history-section">
            <div class="history-title">猜测历史</div>
            <div class="history-list">
              <div 
                v-for="(record, index) in guessHistory" 
                :key="index"
                class="history-item"
                :class="record.hintClass"
              >
                <span class="history-guess">{{ record.guess }}</span>
                <span class="history-hint">{{ record.hint }}</span>
              </div>
              <div v-if="guessHistory.length === 0" class="history-empty">
                还没有猜测记录
              </div>
            </div>
          </div>
        </div>

        <div class="game-actions">
          <button 
            v-if="gameStatus !== 'playing'"
            class="action-button neon-green"
            @click="startNewGame"
          >
            开始新游戏
          </button>
          <button 
            v-else
            class="action-button neon-yellow"
            @click="restartGame"
          >
            重新开始
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GuessNumber',
  data() {
    return {
      targetNumber: 0,
      currentGuess: null,
      maxNumber: 100,
      maxAttempts: 10,
      attemptsLeft: 10,
      gameStatus: 'playing', // playing, won, lost
      guessHistory: [],
      lastHint: '',
      hintClass: ''
    }
  },
  computed: {
    statusMessage() {
      switch (this.gameStatus) {
        case 'playing':
          return '游戏中'
        case 'won':
          return '恭喜获胜！'
        case 'lost':
          return '游戏结束'
        default:
          return '准备中'
      }
    },
    resultMessage() {
      if (this.gameStatus === 'won') {
        return '太棒了！你猜对了！'
      } else if (this.gameStatus === 'lost') {
        return '很遗憾，机会用完了'
      }
      return ''
    },
    resultIcon() {
      if (this.gameStatus === 'won') {
        return '🎉'
      } else if (this.gameStatus === 'lost') {
        return '😢'
      }
      return ''
    },
    resultClass() {
      if (this.gameStatus === 'won') {
        return 'neon-green'
      } else if (this.gameStatus === 'lost') {
        return 'neon-pink'
      }
      return ''
    }
  },
  mounted() {
    this.startNewGame()
  },
  methods: {
    startNewGame() {
      this.targetNumber = Math.floor(Math.random() * this.maxNumber) + 1
      this.currentGuess = null
      this.attemptsLeft = this.maxAttempts
      this.gameStatus = 'playing'
      this.guessHistory = []
      this.lastHint = ''
      this.hintClass = ''
    },
    restartGame() {
      if (confirm('确定要重新开始游戏吗？当前进度将丢失。')) {
        this.startNewGame()
      }
    },
    makeGuess() {
      if (!this.currentGuess || this.gameStatus !== 'playing') {
        return
      }

      const guess = parseInt(this.currentGuess)
      
      if (isNaN(guess) || guess < 1 || guess > this.maxNumber) {
        alert(`请输入 1 到 ${this.maxNumber} 之间的数字！`)
        return
      }

      this.attemptsLeft--
      let hint = ''
      let hintClass = ''

      if (guess === this.targetNumber) {
        this.gameStatus = 'won'
        hint = '🎯 完全正确！'
        hintClass = 'neon-green'
      } else if (guess < this.targetNumber) {
        hint = `📈 太小了，再大一点！`
        hintClass = 'neon-cyan'
      } else {
        hint = `📉 太大了，再小一点！`
        hintClass = 'neon-pink'
      }

      this.lastHint = hint
      this.hintClass = hintClass

      this.guessHistory.unshift({
        guess: guess,
        hint: hint,
        hintClass: hintClass
      })

      if (this.attemptsLeft === 0 && this.gameStatus === 'playing') {
        this.gameStatus = 'lost'
      }

      this.currentGuess = null
    },
    goBack() {
      this.$router.push('/entertainment')
    }
  }
}
</script>

<style scoped>
.guess-number-page {
  min-height: calc(100vh - 70px);
  padding: 100px 20px 60px;
  position: relative;
  z-index: 10;
  max-width: 1000px;
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
  animation: fadeInUp 0.8s ease-out 0.2s backwards;
}

.game-card {
  padding: 40px;
}

.game-info {
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid rgba(0, 217, 255, 0.2);
  flex-wrap: wrap;
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.info-label {
  font-size: 0.9em;
  color: var(--cyber-text-secondary);
  letter-spacing: 1px;
}

.info-value {
  font-size: 1.5em;
  font-weight: 600;
  letter-spacing: 1px;
}

.game-area {
  margin-bottom: 30px;
}

.input-section {
  margin-bottom: 30px;
}

.hint-display {
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}

.hint-text {
  font-size: 1.3em;
  font-weight: 600;
  padding: 15px 30px;
  border-radius: 8px;
  text-align: center;
  animation: pulse 0.5s ease;
}

.guess-input-wrapper {
  display: flex;
  gap: 15px;
  max-width: 500px;
  margin: 0 auto;
}

.guess-input {
  flex: 1;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid var(--cyber-neon-cyan);
  border-radius: 6px;
  color: var(--cyber-text-primary);
  font-size: 1.2em;
  font-family: 'Orbitron', monospace;
  text-align: center;
  transition: all 0.3s ease;
}

.guess-input:focus {
  outline: none;
  border-color: var(--cyber-neon-pink);
  box-shadow: 0 0 20px rgba(255, 0, 136, 0.3);
}

.guess-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.guess-button {
  padding: 15px 40px;
  background: linear-gradient(135deg, var(--cyber-neon-cyan), var(--cyber-neon-purple));
  border: none;
  border-radius: 6px;
  color: var(--cyber-bg-dark);
  font-size: 1.2em;
  font-weight: 600;
  font-family: 'Orbitron', monospace;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.guess-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0, 217, 255, 0.4);
}

.guess-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.result-section {
  margin-bottom: 30px;
}

.result-message {
  text-align: center;
  padding: 40px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.3);
  animation: fadeInScale 0.5s ease;
}

.result-icon {
  font-size: 4em;
  margin-bottom: 20px;
  display: block;
}

.result-text {
  font-size: 2em;
  font-weight: 600;
  margin-bottom: 15px;
  letter-spacing: 1px;
}

.result-detail {
  font-size: 1.2em;
  color: var(--cyber-text-secondary);
  margin-top: 10px;
}

.history-section {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid rgba(0, 217, 255, 0.2);
}

.history-title {
  font-size: 1.2em;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--cyber-text-primary);
  text-align: center;
  letter-spacing: 1px;
}

.history-list {
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  border-left: 3px solid;
  animation: slideInRight 0.3s ease;
}

.history-guess {
  font-size: 1.1em;
  font-weight: 600;
  font-family: 'Orbitron', monospace;
}

.history-hint {
  font-size: 0.95em;
}

.history-empty {
  text-align: center;
  padding: 30px;
  color: var(--cyber-text-secondary);
  font-style: italic;
}

.game-actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid rgba(0, 217, 255, 0.2);
}

.action-button {
  padding: 12px 40px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid;
  border-radius: 6px;
  color: currentColor;
  font-size: 1em;
  font-weight: 600;
  font-family: 'Orbitron', monospace;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.action-button:hover {
  background: rgba(0, 0, 0, 0.7);
  box-shadow: 0 0 20px currentColor;
  transform: translateY(-2px);
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

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .guess-number-page {
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

  .game-card {
    padding: 25px;
  }

  .game-info {
    flex-direction: column;
    align-items: center;
  }

  .guess-input-wrapper {
    flex-direction: column;
  }

  .guess-button {
    width: 100%;
  }

  .result-text {
    font-size: 1.5em;
  }
}
</style>

