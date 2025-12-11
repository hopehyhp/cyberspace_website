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
        <div class="weather-section">
          <div class="weather-card cyber-card" v-if="weatherData">
            <div class="weather-header">
              <div class="weather-location">
                <span class="location-icon">📍</span>
                <span class="location-name">{{ weatherData.location }}</span>
              </div>
              <div class="weather-temp">
                <span class="temp-value">{{ weatherData.temperature }}°C</span>
                <span class="weather-desc">{{ weatherData.description }}</span>
              </div>
            </div>
            <div class="weather-details">
              <div class="weather-item">
                <span class="weather-label">体感温度</span>
                <span class="weather-value">{{ weatherData.feelsLike }}°C</span>
              </div>
              <div class="weather-item">
                <span class="weather-label">湿度</span>
                <span class="weather-value">{{ weatherData.humidity }}%</span>
              </div>
              <div class="weather-item">
                <span class="weather-label">风速</span>
                <span class="weather-value">{{ weatherData.windSpeed }} km/h</span>
              </div>
            </div>
            <div class="weather-tip" :class="weatherData.tipClass">
              <span class="tip-icon">{{ weatherData.tipIcon }}</span>
              <span class="tip-text">{{ weatherData.tip }}</span>
            </div>
          </div>
          <div class="weather-loading cyber-card" v-else-if="loading">
            <div class="loading-spinner"></div>
            <p class="loading-text">正在获取天气信息...</p>
          </div>
          <div class="weather-error cyber-card" v-else-if="error">
            <span class="error-icon">⚠️</span>
            <p class="error-text">{{ error }}</p>
            <button class="cyber-button" @click="fetchWeather" style="margin-top: 16px;">
              重试
            </button>
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
  data() {
    return {
      weatherData: null,
      loading: false,
      error: null
    }
  },
  mounted() {
    this.fetchWeather()
  },
  methods: {
    async fetchWeather() {
      this.loading = true
      this.error = null
      this.weatherData = null

      try {
        // 首先尝试获取用户位置
        const position = await this.getUserLocation()
        const { latitude, longitude } = position.coords

        // 使用 wttr.in API 获取天气（免费，无需 API key）
        const weatherResponse = await fetch(
          `https://wttr.in/${latitude},${longitude}?format=j1&lang=zh`
        )

        if (!weatherResponse.ok) {
          throw new Error('天气服务暂时不可用')
        }

        const weatherJson = await weatherResponse.json()
        const current = weatherJson.current_condition[0]
        const location = weatherJson.nearest_area[0]

        // 获取城市名称
        const cityName = location.areaName[0].value || 
                        location.region[0].value || 
                        '当前位置'

        // 解析天气数据
        this.weatherData = {
          location: cityName,
          temperature: current.temp_C,
          description: current.lang_zh[0].value || current.weatherDesc[0].value,
          feelsLike: current.FeelsLikeC,
          humidity: current.humidity,
          windSpeed: current.windspeedKmph,
          ...this.getWeatherTip(current.temp_C, current.weatherCode, current.humidity)
        }
      } catch (err) {
        console.error('获取天气失败:', err)
        this.error = err.message || '无法获取天气信息，请检查网络连接或位置权限'
      } finally {
        this.loading = false
      }
    },

    getUserLocation() {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('您的浏览器不支持地理位置服务'))
          return
        }

        navigator.geolocation.getCurrentPosition(
          resolve,
          () => {
            // 如果用户拒绝位置权限，尝试使用 IP 定位
            this.fetchWeatherByIP()
              .then(resolve)
              .catch(() => reject(new Error('无法获取您的位置信息，请允许位置访问权限')))
          },
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 3600000 // 缓存1小时
          }
        )
      })
    },

    async fetchWeatherByIP() {
      try {
        // 使用 IP 定位服务获取大致位置
        const ipResponse = await fetch('https://ipapi.co/json/')
        const ipData = await ipResponse.json()

        if (ipData.error) {
          throw new Error('IP定位失败')
        }

        // 返回模拟的坐标对象
        return {
          coords: {
            latitude: ipData.latitude,
            longitude: ipData.longitude
          }
        }
      } catch (err) {
        throw new Error('无法通过IP获取位置')
      }
    },

    getWeatherTip(temp, weatherCode, humidity) {
      const tempNum = parseInt(temp)
      let tip = ''
      let tipIcon = '☀️'
      let tipClass = 'tip-normal'

      // 根据温度判断
      if (tempNum >= 35) {
        tip = '天气炎热，注意防暑降温，多补充水分，避免长时间户外活动'
        tipIcon = '🔥'
        tipClass = 'tip-hot'
      } else if (tempNum >= 28) {
        tip = '天气较热，建议穿着轻薄透气的衣物，注意防晒'
        tipIcon = '☀️'
        tipClass = 'tip-warm'
      } else if (tempNum >= 20) {
        tip = '天气舒适，适合外出活动，享受美好的一天'
        tipIcon = '🌤️'
        tipClass = 'tip-normal'
      } else if (tempNum >= 10) {
        tip = '天气微凉，记得添件薄外套，注意保暖'
        tipIcon = '🍂'
        tipClass = 'tip-cool'
      } else if (tempNum >= 0) {
        tip = '天气较冷，注意保暖，多穿衣物，预防感冒'
        tipIcon = '🧥'
        tipClass = 'tip-cold'
      } else {
        tip = '天气寒冷，注意防寒保暖，尽量减少户外活动'
        tipIcon = '❄️'
        tipClass = 'tip-freezing'
      }

      // 根据天气代码调整提示
      const code = parseInt(weatherCode)
      if (code >= 200 && code < 300) {
        tip = '有雷雨天气，请注意安全，避免在户外或高处停留'
        tipIcon = '⛈️'
        tipClass = 'tip-storm'
      } else if (code >= 300 && code < 400) {
        tip = '有降雨，记得带伞，注意路面湿滑'
        tipIcon = '🌧️'
        tipClass = 'tip-rain'
      } else if (code >= 500 && code < 600) {
        tip = '正在下雨，出门记得带伞，注意交通安全'
        tipIcon = '🌧️'
        tipClass = 'tip-rain'
      } else if (code >= 600 && code < 700) {
        tip = '有降雪，注意保暖，出行注意安全'
        tipIcon = '❄️'
        tipClass = 'tip-snow'
      } else if (code >= 700 && code < 800) {
        tip = '有雾霾或沙尘，建议减少户外活动，出门佩戴口罩'
        tipIcon = '🌫️'
        tipClass = 'tip-fog'
      }

      // 根据湿度调整
      if (humidity > 80) {
        tip += '，湿度较高，注意通风'
      } else if (humidity < 30) {
        tip += '，空气干燥，注意补充水分'
      }

      return { tip, tipIcon, tipClass }
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

.weather-section {
  width: 100%;
  max-width: 500px;
}

.weather-card {
  animation: fadeInUp 0.8s ease-out;
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--cyber-glass-border);
}

.weather-location {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1em;
  color: var(--cyber-text-primary);
}

.location-icon {
  font-size: 1.2em;
}

.location-name {
  font-weight: 600;
  color: var(--cyber-neon-cyan);
}

.weather-temp {
  text-align: right;
}

.temp-value {
  display: block;
  font-size: 2.5em;
  font-weight: 700;
  color: var(--cyber-neon-cyan);
  line-height: 1;
  margin-bottom: 8px;
  text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
}

.weather-desc {
  display: block;
  font-size: 0.9em;
  color: var(--cyber-text-secondary);
  text-transform: capitalize;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.weather-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;
}

.weather-label {
  font-size: 0.85em;
  color: var(--cyber-text-secondary);
}

.weather-value {
  font-size: 1.1em;
  font-weight: 600;
  color: var(--cyber-text-primary);
}

.weather-tip {
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--cyber-glass-border);
  animation: pulse 2s ease-in-out infinite;
}

.weather-tip.tip-hot {
  border-color: var(--cyber-neon-pink);
  background: rgba(255, 0, 128, 0.1);
}

.weather-tip.tip-warm {
  border-color: var(--cyber-neon-yellow);
  background: rgba(255, 215, 0, 0.1);
}

.weather-tip.tip-normal {
  border-color: var(--cyber-neon-green);
  background: rgba(0, 255, 136, 0.1);
}

.weather-tip.tip-cool {
  border-color: var(--cyber-neon-cyan);
  background: rgba(0, 217, 255, 0.1);
}

.weather-tip.tip-cold {
  border-color: var(--cyber-neon-blue);
  background: rgba(0, 102, 255, 0.1);
}

.weather-tip.tip-freezing {
  border-color: var(--cyber-neon-purple);
  background: rgba(176, 38, 255, 0.1);
}

.weather-tip.tip-rain,
.weather-tip.tip-storm {
  border-color: var(--cyber-neon-blue);
  background: rgba(0, 102, 255, 0.15);
}

.weather-tip.tip-snow {
  border-color: var(--cyber-neon-cyan);
  background: rgba(0, 217, 255, 0.15);
}

.weather-tip.tip-fog {
  border-color: var(--cyber-text-secondary);
  background: rgba(138, 138, 154, 0.1);
}

.tip-icon {
  font-size: 1.5em;
  flex-shrink: 0;
}

.tip-text {
  flex: 1;
  line-height: 1.6;
  color: var(--cyber-text-primary);
  font-size: 0.95em;
}

.weather-loading,
.weather-error {
  text-align: center;
  padding: 40px 32px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 20px;
  border: 3px solid var(--cyber-glass-border);
  border-top-color: var(--cyber-neon-cyan);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: var(--cyber-text-secondary);
  font-size: 0.95em;
}

.weather-error {
  color: var(--cyber-text-primary);
}

.error-icon {
  font-size: 3em;
  display: block;
  margin-bottom: 16px;
}

.error-text {
  color: var(--cyber-text-secondary);
  margin-bottom: 16px;
  line-height: 1.6;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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

  .weather-section {
    max-width: 100%;
  }

  .weather-details {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .temp-value {
    font-size: 2em;
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

