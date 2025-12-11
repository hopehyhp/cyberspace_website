<template>
  <div id="app">
    <Navigation />
    <main class="main-content">
      <transition name="page">
        <router-view />
      </transition>
    </main>
    <footer class="site-footer">
      <div class="footer-text">
        <span class="neon-green">[SYSTEM]</span>
        <span class="footer-info">欢迎来到我的数字世界</span>
        <span class="neon-purple">[ONLINE]</span>
      </div>
    </footer>
  </div>
</template>

<script>
import Navigation from './components/Navigation.vue'

export default {
  name: 'App',
  components: {
    Navigation
  }
}
</script>

<style>
#app {
  min-height: 100vh;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  position: relative;
  z-index: 10;
  padding-top: 70px;
}

.site-footer {
  margin-top: auto;
  padding: 30px 20px;
  text-align: center;
  border-top: 1px solid var(--cyber-glass-border);
  position: relative;
  background: rgba(10, 10, 15, 0.5);
  backdrop-filter: blur(10px);
}

.footer-text {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  font-size: 0.9em;
  letter-spacing: 2px;
}

.footer-info {
  color: var(--cyber-text-secondary);
}

@media (max-width: 768px) {
  .main-content {
    padding-top: 60px;
  }
  
  .footer-text {
    flex-direction: column;
    gap: 10px;
    font-size: 0.85em;
  }
}
</style>
