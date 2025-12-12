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
        <div class="daily-section">
          <div class="daily-card cyber-card">
            <div class="daily-date">
              <span class="date-icon">📅</span>
              <span class="date-text">{{ todayDate }}</span>
            </div>
            <div class="daily-quote">
              <span class="quote-icon">💫</span>
              <p class="quote-text">{{ dailyQuote }}</p>
            </div>
          </div>
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
  name: 'HomePage',
  computed: {
    todayDate() {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      const day = now.getDate()
      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      const weekday = weekdays[now.getDay()]
      return `${year}年${month}月${day}日 ${weekday}`
    },
    dailyQuote() {
      // 根据日期选择不同的心灵鸡汤，确保每天显示不同的内容
      const quotes = [
        '每一个不曾起舞的日子，都是对生命的辜负。',
        '生活不是等待暴风雨过去，而是要学会在雨中翩翩起舞。',
        '成功不是终点，失败也不是末日，继续前进的勇气才是最重要的。',
        '今天的你，是过去习惯的结果；未来的你，是今天习惯的结果。',
        '不要害怕你的生活将要结束，应该担心你的生活永远不会真正开始。',
        '人生没有白走的路，每一步都算数。',
        '当你觉得为时已晚的时候，恰恰是最早的时候。',
        '生活就像骑自行车，想保持平衡就得往前走。',
        '只有经历过地狱般的磨砺，才能练就创造天堂的力量。',
        '不要等待机会，而要创造机会。',
        '成功不是将来才有的，而是从决定去做的那一刻起，持续累积而成。',
        '每一个优秀的人，都有一段沉默的时光。那一段时光，是付出了很多努力，忍受孤独和寂寞，不抱怨不诉苦，日后说起时，连自己都能被感动的日子。',
        '人生最大的敌人是自己，最大的失败是自大，最大的无知是欺骗，最大的悲哀是妒忌，最大的错误是自弃。',
        '生活不可能像你想象的那么好，但也不会像你想象的那么糟。',
        '路漫漫其修远兮，吾将上下而求索。',
        '山重水复疑无路，柳暗花明又一村。',
        '宝剑锋从磨砺出，梅花香自苦寒来。',
        '不积跬步，无以至千里；不积小流，无以成江海。',
        '天行健，君子以自强不息；地势坤，君子以厚德载物。',
        '长风破浪会有时，直挂云帆济沧海。',
        '千淘万漉虽辛苦，吹尽狂沙始到金。',
        '世上无难事，只怕有心人。',
        '只要功夫深，铁杵磨成针。',
        '有志者，事竟成，破釜沉舟，百二秦关终属楚；苦心人，天不负，卧薪尝胆，三千越甲可吞吴。',
        '机会总是留给有准备的人。',
        '与其临渊羡鱼，不如退而结网。',
        '行动是治愈恐惧的良药，而犹豫、拖延将不断滋养恐惧。',
        '没有比脚更长的路，没有比人更高的山。',
        '相信自己，你能作茧自缚，就能破茧成蝶。',
        '生活不是林黛玉，不会因为忧伤而风情万种。'
      ]
      
      // 使用日期作为种子，确保每天显示不同的鸡汤
      const today = new Date()
      const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)
      const index = dayOfYear % quotes.length
      return quotes[index]
    }
  }
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

.daily-section {
  width: 100%;
  max-width: 500px;
}

.daily-card {
  animation: fadeInUp 0.8s ease-out;
  padding: 32px;
}

.daily-date {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--cyber-glass-border);
}

.date-icon {
  font-size: 1.5em;
}

.date-text {
  font-size: 1.3em;
  font-weight: 600;
  color: var(--cyber-neon-cyan);
  text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
}

.daily-quote {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--cyber-glass-border);
  animation: pulse 2s ease-in-out infinite;
}

.quote-icon {
  font-size: 2em;
  flex-shrink: 0;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
}

.quote-text {
  flex: 1;
  line-height: 1.8;
  color: var(--cyber-text-primary);
  font-size: 1.1em;
  font-style: italic;
  margin: 0;
  text-align: left;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
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

  .daily-section {
    max-width: 100%;
  }

  .daily-card {
    padding: 24px;
  }

  .date-text {
    font-size: 1.1em;
  }

  .quote-text {
    font-size: 1em;
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

