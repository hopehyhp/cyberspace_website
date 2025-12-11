<template>
  <nav class="navigation">
    <div class="nav-container">
      <div class="nav-brand">
        <router-link to="/" class="brand-link">
          <span class="brand-text neon-cyan">CYBERSPACE</span>
          <span class="brand-dot neon-pink">.</span>
        </router-link>
      </div>
      
      <div class="nav-menu" :class="{ 'active': menuOpen }">
        <router-link 
          to="/" 
          class="nav-link"
          exact-active-class="active"
          @click="closeMenu"
        >
          <span class="nav-icon">⌂</span>
          <span class="nav-text">首页</span>
        </router-link>
        
        <router-link 
          to="/about" 
          class="nav-link"
          active-class="active"
          @click="closeMenu"
        >
          <span class="nav-icon">⚡</span>
          <span class="nav-text">关于</span>
        </router-link>
        
        <router-link 
          to="/messages" 
          class="nav-link"
          active-class="active"
          @click="closeMenu"
        >
          <span class="nav-icon">✉</span>
          <span class="nav-text">留言</span>
        </router-link>
        
        <router-link 
          to="/entertainment" 
          class="nav-link"
          active-class="active"
          @click="closeMenu"
        >
          <span class="nav-icon">🎮</span>
          <span class="nav-text">娱乐</span>
        </router-link>
      </div>
      
      <button 
        class="nav-toggle"
        @click="toggleMenu"
        :aria-label="menuOpen ? '关闭菜单' : '打开菜单'"
      >
        <span class="toggle-line" :class="{ 'active': menuOpen }"></span>
        <span class="toggle-line" :class="{ 'active': menuOpen }"></span>
        <span class="toggle-line" :class="{ 'active': menuOpen }"></span>
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavigationMenu',
  data() {
    return {
      menuOpen: false
    }
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen
    },
    closeMenu() {
      this.menuOpen = false
    }
  },
  watch: {
    $route() {
      this.closeMenu()
    }
  }
}
</script>

<style scoped>
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(10, 10, 15, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--cyber-glass-border);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.nav-brand {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 1.5em;
  font-weight: 700;
  letter-spacing: 2px;
  transition: all 0.3s ease;
}

.brand-text {
  transition: all 0.3s ease;
}

.brand-dot {
  margin-left: 4px;
  font-size: 1.2em;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.brand-link:hover .brand-text {
  text-shadow: 
    0 0 8px var(--cyber-neon-cyan),
    0 0 16px var(--cyber-neon-cyan);
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  text-decoration: none;
  color: var(--cyber-text-secondary);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--cyber-neon-cyan);
  transform: translateX(-50%);
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: var(--cyber-text-primary);
  background: rgba(0, 217, 255, 0.05);
}

.nav-link:hover::before {
  width: 80%;
}

.nav-link.active {
  color: var(--cyber-neon-cyan);
  background: rgba(0, 217, 255, 0.1);
}

.nav-link.active::before {
  width: 80%;
}

.nav-link.active .nav-icon {
  transform: scale(1.2);
  filter: drop-shadow(0 0 8px var(--cyber-neon-cyan));
}

.nav-icon {
  font-size: 1.2em;
  transition: all 0.3s ease;
}

.nav-text {
  position: relative;
}

.nav-toggle {
  display: none;
  flex-direction: column;
  gap: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 1001;
}

.toggle-line {
  width: 24px;
  height: 2px;
  background: var(--cyber-neon-cyan);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 4px var(--cyber-neon-cyan);
}

.toggle-line.active:nth-child(1) {
  transform: rotate(45deg) translate(8px, 8px);
}

.toggle-line.active:nth-child(2) {
  opacity: 0;
}

.toggle-line.active:nth-child(3) {
  transform: rotate(-45deg) translate(8px, -8px);
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 16px;
    height: 60px;
  }
  
  .nav-toggle {
    display: flex;
  }
  
  .nav-menu {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: rgba(10, 10, 15, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--cyber-glass-border);
    padding: 20px;
    gap: 12px;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }
  
  .nav-menu.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .nav-link {
    width: 100%;
    justify-content: flex-start;
    padding: 16px 20px;
    border-radius: 8px;
  }
  
  .brand-link {
    font-size: 1.3em;
  }
}
</style>

