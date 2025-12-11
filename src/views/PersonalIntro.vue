<template>
  <div class="personal-intro-page">
    <div class="page-header">
      <h1 class="page-title">
        <span class="neon-cyan neon-glow">个人介绍</span>
      </h1>
      <p class="page-subtitle">探索我的数字身份</p>
    </div>

    <div class="intro-content-wrapper">
      <div class="cyber-card intro-container">
        <div class="intro-content">
          <div class="avatar-section">
            <div class="avatar-frame">
              <div class="avatar-placeholder">
                <img :src="avatarImage" alt="头像" class="avatar-image" />
              </div>
              <div class="avatar-border"></div>
            </div>
          </div>

          <div class="info-section">
            <div class="info-item">
              <span class="label neon-cyan">姓名:</span>
              <span class="value neon-green">Hope hyhp</span>
            </div>
            <div class="info-item">
              <span class="label neon-cyan">职业:</span>
              <span class="value neon-green">Full Stack Software Engineer</span>
            </div>
            <div class="info-item">
              <span class="label neon-cyan">技能:</span>
              <div class="skills">
                <span
                  v-for="(skill, index) in skills"
                  :key="index"
                  class="skill-tag neon-purple"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
            <div class="info-item">
              <span class="label neon-cyan">简介:</span>
              <p class="description">
                欢迎来到我的赛博空间！我是一名充满激情的开发者/设计师，
                致力于创造令人惊叹的数字体验。在这个充满霓虹灯和未来感的世界里，
                我将分享我的项目、想法和创作。
              </p>
            </div>
          </div>
        </div>

        <div class="stats-section">
          <div class="stat-item">
            <div class="stat-value neon-pink">∞</div>
            <div class="stat-label">项目</div>
          </div>
          <div class="stat-item">
            <div class="stat-value neon-cyan">24/7</div>
            <div class="stat-label">在线</div>
          </div>
          <div class="stat-item">
            <div class="stat-value neon-green">100%</div>
            <div class="stat-label">热情</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import avatarImage from '@/assets/userImage.png'

export default {
  name: 'PersonalIntro',
  data() {
    return {
      skills: ['Vue', 'Angular', 'TypeScripts', 'JavaScript', 'CSS3', 'HTML5'],
      avatarImage: avatarImage
    }
  }
}
</script>

<style scoped>
.personal-intro-page {
  min-height: calc(100vh - 70px);
  padding: 100px 20px 60px;
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

.intro-content-wrapper {
  animation: fadeInUp 0.8s ease-out 0.2s backwards;
}

.intro-container {
  max-width: 900px;
  margin: 0 auto;
}

.intro-content {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 50px;
  margin-bottom: 50px;
}

.avatar-section {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.avatar-frame {
  position: relative;
  width: 200px;
  height: 200px;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(0, 217, 255, 0.05);
  border: 2px solid var(--cyber-glass-border);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.avatar-placeholder::before {
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
  z-index: 1;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  position: relative;
  z-index: 2;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.avatar-border {
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border: 2px solid var(--cyber-neon-pink);
  border-radius: 12px;
  animation: border-pulse 3s ease-in-out infinite;
  pointer-events: none;
}

@keyframes border-pulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.label {
  font-size: 1.1em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 4px;
}

.value {
  font-size: 1.3em;
  font-weight: 500;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.skill-tag {
  padding: 8px 16px;
  border: 1px solid currentColor;
  border-radius: 6px;
  font-size: 0.95em;
  font-weight: 500;
  background: rgba(176, 38, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  backdrop-filter: blur(10px);
}

.skill-tag:hover {
  background: rgba(176, 38, 255, 0.2);
  transform: translateY(-3px);
  box-shadow:
    0 4px 12px rgba(176, 38, 255, 0.3),
    0 0 20px currentColor;
}

.description {
  line-height: 1.9;
  color: var(--cyber-text-secondary);
  font-size: 1.05em;
  text-align: justify;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding-top: 40px;
  border-top: 1px solid var(--cyber-glass-border);
}

.stat-item {
  text-align: center;
  padding: 32px 24px;
  border: 1px solid var(--cyber-glass-border);
  border-radius: 12px;
  background: rgba(0, 217, 255, 0.03);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.stat-item:hover {
  background: rgba(0, 217, 255, 0.08);
  transform: translateY(-5px);
  border-color: var(--cyber-neon-cyan);
  box-shadow:
    0 8px 24px rgba(0, 217, 255, 0.2),
    0 0 30px rgba(0, 217, 255, 0.1);
}

.stat-value {
  font-size: 3em;
  font-weight: 700;
  margin-bottom: 12px;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.stat-label {
  color: var(--cyber-text-secondary);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.9em;
  font-weight: 500;
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
  .personal-intro-page {
    padding: 80px 16px 40px;
  }

  .page-title {
    font-size: 2.5em;
  }

  .intro-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }

  .avatar-frame {
    margin: 0 auto;
  }

  .stats-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .description {
    text-align: left;
  }
}
</style>

