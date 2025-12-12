<template>
  <div class="tetris-page">
    <div class="game-header">
      <button class="back-button" @click="goBack">
        <span class="back-icon">←</span>
        <span>返回娱乐分区</span>
      </button>
      <h1 class="game-title">
        <span class="neon-cyan neon-glow">俄罗斯方块</span>
      </h1>
    </div>
    
    <div class="game-container">
      <div class="cyber-card game-board-card">
        <div class="game-info">
          <div class="info-item">
            <span class="info-label">分数:</span>
            <span class="info-value neon-green">{{ score }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">等级:</span>
            <span class="info-value neon-cyan">{{ level }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">行数:</span>
            <span class="info-value neon-purple">{{ lines }}</span>
          </div>
        </div>
        
        <div class="board-container">
          <canvas 
            ref="gameCanvas" 
            class="game-canvas"
            :width="canvasWidth" 
            :height="canvasHeight"
          ></canvas>
        </div>
        
        <div class="game-status" v-if="gameOver">
          <div class="status-overlay">
            <h2 class="status-title neon-pink">游戏结束</h2>
            <p class="status-text">最终分数: {{ score }}</p>
            <button class="cyber-button" @click="startGame">重新开始</button>
          </div>
        </div>
        
        <div class="game-controls">
          <button 
            class="cyber-button" 
            @click="togglePause"
            v-if="!gameOver && isPlaying"
          >
            {{ isPaused ? '继续' : '暂停' }}
          </button>
          <button 
            class="cyber-button" 
            @click="startGame"
            v-if="!isPlaying || gameOver"
          >
            {{ gameOver ? '重新开始' : '开始游戏' }}
          </button>
          <button 
            class="cyber-button reset-button" 
            @click="resetGame"
            v-if="isPlaying && !gameOver"
          >
            重新开始
          </button>
        </div>
      </div>
      
      <div class="cyber-card game-sidebar">
        <div class="next-piece-section">
          <h3 class="section-title neon-purple">下一个</h3>
          <canvas 
            ref="nextCanvas" 
            class="next-canvas"
            :width="120" 
            :height="120"
          ></canvas>
        </div>
        
        <div class="controls-section">
          <h3 class="section-title neon-purple">操作说明</h3>
          <ul class="controls-list">
            <li><span class="key">←</span> 左移</li>
            <li><span class="key">→</span> 右移</li>
            <li><span class="key">↓</span> 加速下降</li>
            <li><span class="key">↑</span> 旋转</li>
            <li><span class="key">空格</span> 暂停/继续</li>
          </ul>
        </div>
        
        <div class="rules-section">
          <h3 class="section-title neon-purple">游戏规则</h3>
          <ul class="rules-list">
            <li>消除完整的一行可以得分</li>
            <li>同时消除多行可获得更高分数</li>
            <li>随着等级提升，方块下降速度加快</li>
            <li>当方块堆到顶部时游戏结束</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TetrisGame',
  data() {
    return {
      canvasWidth: 300,
      canvasHeight: 600,
      cellSize: 30,
      board: [],
      boardWidth: 10,
      boardHeight: 20,
      currentPiece: null,
      nextPiece: null,
      score: 0,
      lines: 0,
      level: 1,
      isPlaying: false,
      isPaused: false,
      gameOver: false,
      dropCounter: 0,
      dropInterval: 1000,
      lastTime: 0,
      gameLoop: null,
      pieces: [
        // I 型
        [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        // O 型
        [
          [2, 2],
          [2, 2]
        ],
        // T 型
        [
          [0, 3, 0],
          [3, 3, 3],
          [0, 0, 0]
        ],
        // S 型
        [
          [0, 4, 4],
          [4, 4, 0],
          [0, 0, 0]
        ],
        // Z 型
        [
          [5, 5, 0],
          [0, 5, 5],
          [0, 0, 0]
        ],
        // J 型
        [
          [6, 0, 0],
          [6, 6, 6],
          [0, 0, 0]
        ],
        // L 型
        [
          [0, 0, 7],
          [7, 7, 7],
          [0, 0, 0]
        ]
      ],
      colors: [
        '#000000', // 0 - 空白
        '#00d9ff', // 1 - I 型 - 青色
        '#ff00ff', // 2 - O 型 - 紫色
        '#ff0080', // 3 - T 型 - 粉色
        '#00ff88', // 4 - S 型 - 绿色
        '#ffff00', // 5 - Z 型 - 黄色
        '#ff8000', // 6 - J 型 - 橙色
        '#0080ff'  // 7 - L 型 - 蓝色
      ]
    }
  },
  mounted() {
    this.initBoard()
    this.setupKeyboard()
    this.drawNextPiece()
  },
  beforeDestroy() {
    this.removeKeyboard()
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop)
    }
  },
  methods: {
    initBoard() {
      this.board = Array(this.boardHeight).fill(null).map(() => 
        Array(this.boardWidth).fill(0)
      )
    },
    
    createPiece() {
      const type = Math.floor(Math.random() * this.pieces.length)
      const piece = this.pieces[type].map(row => [...row])
      return {
        matrix: piece,
        x: Math.floor(this.boardWidth / 2) - Math.floor(piece[0].length / 2),
        y: 0
      }
    },
    
    drawBoard(ctx) {
      // 绘制背景
      ctx.fillStyle = 'rgba(10, 10, 15, 0.9)'
      ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
      
      // 绘制网格
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.2)'
      ctx.lineWidth = 1
      for (let x = 0; x <= this.boardWidth; x++) {
        ctx.beginPath()
        ctx.moveTo(x * this.cellSize, 0)
        ctx.lineTo(x * this.cellSize, this.canvasHeight)
        ctx.stroke()
      }
      for (let y = 0; y <= this.boardHeight; y++) {
        ctx.beginPath()
        ctx.moveTo(0, y * this.cellSize)
        ctx.lineTo(this.canvasWidth, y * this.cellSize)
        ctx.stroke()
      }
      
      // 绘制已放置的方块
      for (let y = 0; y < this.boardHeight; y++) {
        for (let x = 0; x < this.boardWidth; x++) {
          if (this.board[y][x]) {
            this.drawCell(ctx, x, y, this.colors[this.board[y][x]])
          }
        }
      }
    },
    
    drawPiece(ctx, piece) {
      if (!piece) return
      
      piece.matrix.forEach((row, dy) => {
        row.forEach((value, dx) => {
          if (value) {
            this.drawCell(
              ctx,
              piece.x + dx,
              piece.y + dy,
              this.colors[value]
            )
          }
        })
      })
    },
    
    drawCell(ctx, x, y, color) {
      const pixelX = x * this.cellSize
      const pixelY = y * this.cellSize
      
      // 绘制方块主体
      ctx.fillStyle = color
      ctx.fillRect(pixelX + 1, pixelY + 1, this.cellSize - 2, this.cellSize - 2)
      
      // 绘制高光效果
      const gradient = ctx.createLinearGradient(
        pixelX, pixelY,
        pixelX + this.cellSize, pixelY + this.cellSize
      )
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)')
      ctx.fillStyle = gradient
      ctx.fillRect(pixelX + 1, pixelY + 1, this.cellSize - 2, this.cellSize - 2)
      
      // 绘制边框
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.strokeRect(pixelX + 1, pixelY + 1, this.cellSize - 2, this.cellSize - 2)
      
      // 绘制发光效果
      ctx.shadowBlur = 10
      ctx.shadowColor = color
      ctx.strokeRect(pixelX + 1, pixelY + 1, this.cellSize - 2, this.cellSize - 2)
      ctx.shadowBlur = 0
    },
    
    drawNextPiece() {
      if (!this.nextPiece) return
      
      const canvas = this.$refs.nextCanvas
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const size = 20
      const offsetX = (canvas.width - this.nextPiece.matrix[0].length * size) / 2
      const offsetY = (canvas.height - this.nextPiece.matrix.length * size) / 2
      
      this.nextPiece.matrix.forEach((row, dy) => {
        row.forEach((value, dx) => {
          if (value) {
            const x = offsetX + dx * size
            const y = offsetY + dy * size
            
            ctx.fillStyle = this.colors[value]
            ctx.fillRect(x + 1, y + 1, size - 2, size - 2)
            
            ctx.strokeStyle = this.colors[value]
            ctx.lineWidth = 1
            ctx.strokeRect(x + 1, y + 1, size - 2, size - 2)
          }
        })
      })
    },
    
    draw() {
      const canvas = this.$refs.gameCanvas
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      this.drawBoard(ctx)
      
      if (this.currentPiece && !this.gameOver) {
        this.drawPiece(ctx, this.currentPiece)
      }
    },
    
    isValidMove(piece, dx = 0, dy = 0, matrix = null) {
      const testMatrix = matrix || piece.matrix
      const testX = piece.x + dx
      const testY = piece.y + dy
      
      for (let y = 0; y < testMatrix.length; y++) {
        for (let x = 0; x < testMatrix[y].length; x++) {
          if (testMatrix[y][x]) {
            const newX = testX + x
            const newY = testY + y
            
            if (
              newX < 0 ||
              newX >= this.boardWidth ||
              newY >= this.boardHeight ||
              (newY >= 0 && this.board[newY][newX])
            ) {
              return false
            }
          }
        }
      }
      return true
    },
    
    rotatePiece() {
      if (!this.currentPiece) return
      
      const matrix = this.currentPiece.matrix
      const rotated = matrix[0].map((_, i) =>
        matrix.map(row => row[i]).reverse()
      )
      
      if (this.isValidMove(this.currentPiece, 0, 0, rotated)) {
        this.currentPiece.matrix = rotated
        this.draw()
      }
    },
    
    mergePiece() {
      if (!this.currentPiece) return
      
      this.currentPiece.matrix.forEach((row, dy) => {
        row.forEach((value, dx) => {
          if (value) {
            const y = this.currentPiece.y + dy
            const x = this.currentPiece.x + dx
            if (y >= 0) {
              this.board[y][x] = value
            }
          }
        })
      })
    },
    
    clearLines() {
      let linesCleared = 0
      
      for (let y = this.boardHeight - 1; y >= 0; y--) {
        if (this.board[y].every(cell => cell !== 0)) {
          this.board.splice(y, 1)
          this.board.unshift(Array(this.boardWidth).fill(0))
          linesCleared++
          y++ // 重新检查这一行
        }
      }
      
      if (linesCleared > 0) {
        this.lines += linesCleared
        // 计分：单行100，双行300，三行500，四行800
        const points = [0, 100, 300, 500, 800]
        this.score += points[linesCleared] * this.level
        this.level = Math.floor(this.lines / 10) + 1
        this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100)
      }
    },
    
    dropPiece() {
      if (!this.currentPiece) return
      
      if (this.isValidMove(this.currentPiece, 0, 1)) {
        this.currentPiece.y++
        this.draw()
      } else {
        this.mergePiece()
        this.clearLines()
        this.currentPiece = this.nextPiece
        this.nextPiece = this.createPiece()
        this.drawNextPiece()
        
        if (!this.isValidMove(this.currentPiece)) {
          this.gameOver = true
          this.isPlaying = false
        }
      }
    },
    
    movePiece(dx) {
      if (!this.currentPiece || this.gameOver) return
      
      if (this.isValidMove(this.currentPiece, dx, 0)) {
        this.currentPiece.x += dx
        this.draw()
      }
    },
    
    hardDrop() {
      if (!this.currentPiece || this.gameOver) return
      
      while (this.isValidMove(this.currentPiece, 0, 1)) {
        this.currentPiece.y++
      }
      this.dropPiece()
    },
    
    update(time = 0) {
      if (!this.isPlaying || this.isPaused || this.gameOver) {
        this.lastTime = time
        this.gameLoop = requestAnimationFrame(this.update)
        return
      }
      
      const deltaTime = time - this.lastTime
      this.lastTime = time
      this.dropCounter += deltaTime
      
      if (this.dropCounter > this.dropInterval) {
        this.dropPiece()
        this.dropCounter = 0
      }
      
      this.draw()
      this.gameLoop = requestAnimationFrame(this.update)
    },
    
    startGame() {
      // 清理之前的游戏循环
      if (this.gameLoop) {
        cancelAnimationFrame(this.gameLoop)
        this.gameLoop = null
      }
      
      // 重置所有游戏状态
      this.initBoard()
      this.score = 0
      this.lines = 0
      this.level = 1
      this.dropInterval = 1000
      this.dropCounter = 0
      this.gameOver = false
      this.isPaused = false
      this.isPlaying = true
      
      // 创建新的方块
      this.currentPiece = this.createPiece()
      this.nextPiece = this.createPiece()
      this.drawNextPiece()
      this.draw()
      
      // 启动游戏循环
      this.lastTime = performance.now()
      this.gameLoop = requestAnimationFrame(this.update)
    },
    
    resetGame() {
      // 重新开始游戏（与startGame相同，但更明确的命名）
      this.startGame()
    },
    
    togglePause() {
      if (this.gameOver) return
      
      this.isPaused = !this.isPaused
      if (!this.isPaused) {
        this.lastTime = performance.now()
        this.gameLoop = requestAnimationFrame(this.update)
      }
    },
    
    setupKeyboard() {
      this.keyHandler = (e) => {
        if (!this.isPlaying && e.code !== 'Space') return
        
        switch (e.code) {
          case 'ArrowLeft':
            e.preventDefault()
            this.movePiece(-1)
            break
          case 'ArrowRight':
            e.preventDefault()
            this.movePiece(1)
            break
          case 'ArrowDown':
            e.preventDefault()
            this.dropPiece()
            break
          case 'ArrowUp':
            e.preventDefault()
            this.rotatePiece()
            break
          case 'Space':
            e.preventDefault()
            if (this.isPlaying) {
              this.togglePause()
            } else {
              this.startGame()
            }
            break
        }
      }
      
      window.addEventListener('keydown', this.keyHandler)
    },
    
    removeKeyboard() {
      if (this.keyHandler) {
        window.removeEventListener('keydown', this.keyHandler)
      }
    },
    
    goBack() {
      this.isPlaying = false
      this.isPaused = false
      if (this.gameLoop) {
        cancelAnimationFrame(this.gameLoop)
      }
      this.$router.push('/entertainment')
    }
  }
}
</script>

<style scoped>
.tetris-page {
  min-height: calc(100vh - 70px);
  padding: 40px 20px 30px;
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
  margin-bottom: 20px;
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
  font-size: 2.5em;
  font-weight: 800;
  margin: 0;
  letter-spacing: 2px;
  text-align: center;
  flex: 1;
}

.game-container {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 20px;
  animation: fadeInUp 0.8s ease-out 0.2s backwards;
}

.game-board-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.game-info {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid var(--cyber-glass-border);
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.info-label {
  color: var(--cyber-text-secondary);
  font-size: 0.9em;
}

.info-value {
  font-weight: 600;
  font-size: 1.5em;
  text-shadow: 0 0 10px currentColor;
}

.board-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.game-canvas {
  border: 2px solid var(--cyber-neon-cyan);
  border-radius: 8px;
  box-shadow: 
    0 0 20px rgba(0, 217, 255, 0.3),
    inset 0 0 20px rgba(0, 217, 255, 0.1);
  background: rgba(10, 10, 15, 0.9);
}

.game-status {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  z-index: 10;
}

.status-overlay {
  text-align: center;
  padding: 30px;
}

.status-title {
  font-size: 2em;
  margin-bottom: 15px;
  text-shadow: 0 0 20px currentColor;
}

.status-text {
  font-size: 1.3em;
  color: var(--cyber-text-primary);
  margin-bottom: 20px;
}

.game-controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  padding-top: 15px;
  border-top: 1px solid var(--cyber-glass-border);
}

.cyber-button {
  padding: 12px 24px;
  background: rgba(0, 217, 255, 0.1);
  border: 1px solid var(--cyber-neon-cyan);
  color: var(--cyber-neon-cyan);
  border-radius: 6px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 600;
  transition: all 0.3s ease;
  font-family: 'Orbitron', monospace;
  min-width: 120px;
}

.cyber-button:hover {
  background: rgba(0, 217, 255, 0.2);
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.4);
  transform: translateY(-2px);
}

.cyber-button:active {
  transform: translateY(0);
}

.reset-button {
  background: rgba(255, 0, 128, 0.1);
  border-color: var(--cyber-neon-pink);
  color: var(--cyber-neon-pink);
}

.reset-button:hover {
  background: rgba(255, 0, 128, 0.2);
  box-shadow: 0 0 15px rgba(255, 0, 128, 0.4);
}

.game-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: fit-content;
}

.next-piece-section {
  text-align: center;
  padding: 15px;
  border-bottom: 1px solid var(--cyber-glass-border);
}

.section-title {
  font-size: 1.2em;
  margin-bottom: 10px;
  font-weight: 600;
  text-align: center;
}

.next-canvas {
  border: 1px solid var(--cyber-glass-border);
  border-radius: 6px;
  background: rgba(10, 10, 15, 0.5);
  margin: 0 auto;
}

.controls-section {
  padding: 15px;
  border-bottom: 1px solid var(--cyber-glass-border);
}

.controls-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.controls-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  color: var(--cyber-text-secondary);
  border-bottom: 1px solid var(--cyber-glass-border);
}

.controls-list li:last-child {
  border-bottom: none;
}

.key {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(0, 217, 255, 0.1);
  border: 1px solid var(--cyber-neon-cyan);
  border-radius: 4px;
  color: var(--cyber-neon-cyan);
  font-weight: 600;
  font-size: 0.9em;
  min-width: 50px;
  text-align: center;
}

.rules-section {
  padding: 15px;
}

.rules-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.rules-list li {
  padding: 8px 0;
  color: var(--cyber-text-secondary);
  line-height: 1.6;
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

@media (max-width: 968px) {
  .game-container {
    grid-template-columns: 1fr;
  }
  
  .game-sidebar {
    order: -1;
  }
}

@media (max-width: 768px) {
  .tetris-page {
    padding: 30px 16px 20px;
  }

  .back-button {
    position: relative;
    left: 0;
    top: 0;
    transform: none;
    margin-bottom: 10px;
  }
  
  .back-button:hover {
    transform: translateX(-3px);
  }
  
  .game-header {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 15px;
  }
  
  .game-title {
    width: 100%;
    margin-top: 10px;
    font-size: 2em;
  }
  
  .canvasWidth {
    width: 100%;
    max-width: 300px;
  }
  
  .game-info {
    flex-direction: column;
    gap: 15px;
  }
  
  .game-canvas {
    max-width: 100%;
    height: auto;
  }
}
</style>

