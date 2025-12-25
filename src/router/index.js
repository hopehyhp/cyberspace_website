import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import PersonalIntro from '../views/PersonalIntro.vue'
import MessageBoard from '../views/MessageBoard.vue'
import Entertainment from '../views/Entertainment.vue'
import UserManagement from '../views/UserManagement.vue'
import Gomoku3x3 from '../views/games/Gomoku3x3.vue'
import GuessNumber from '../views/games/GuessNumber.vue'
import Tetris from '../views/games/Tetris.vue'
import { authUtils } from '../utils/api'
// import GuessIdiom from '../views/games/GuessIdiom.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'PersonalIntro',
    component: PersonalIntro
  },
  {
    path: '/messages',
    name: 'MessageBoard',
    component: MessageBoard
  },
  {
    path: '/entertainment',
    name: 'Entertainment',
    component: Entertainment
  },
  {
    path: '/users',
    name: 'UserManagement',
    component: UserManagement,
    meta: { requiresAdmin: true }
  },
  {
    path: '/entertainment/gomoku3x3',
    name: 'Gomoku3x3',
    component: Gomoku3x3
  },
  {
    path: '/entertainment/guess-number',
    name: 'GuessNumber',
    component: GuessNumber
  },
  {
    path: '/entertainment/tetris',
    name: 'Tetris',
    component: Tetris
  },
  // {
  //   path: '/entertainment/guess-idiom',
  //   name: 'GuessIdiom',
  //   component: GuessIdiom
  // },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 检查路由是否需要管理员权限
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    // 检查用户是否已登录
    if (!authUtils.isAuthenticated()) {
      // 未登录，重定向到首页并显示提示
      next({
        path: '/',
        query: { redirect: to.fullPath }
      })
      
      // 显示提示消息
      setTimeout(() => {
        const notification = document.createElement('div')
        notification.className = 'notification neon-pink'
        notification.textContent = '请先登录管理员账户'
        notification.style.cssText = `
          position: fixed;
          top: 90px;
          right: 20px;
          padding: 16px 28px;
          background: rgba(10, 10, 15, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid var(--cyber-neon-pink);
          border-radius: 8px;
          z-index: 10001;
          animation: slideInRight 0.3s ease;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        `
        document.body.appendChild(notification)

        setTimeout(() => {
          notification.style.animation = 'slideOutRight 0.3s ease'
          setTimeout(() => {
            if (document.body.contains(notification)) {
              document.body.removeChild(notification)
            }
          }, 300)
        }, 3000)
      }, 100)
      
      return
    }
    
    // 检查用户是否是管理员
    if (!authUtils.isAdmin()) {
      // 不是管理员，重定向到首页并显示提示
      next({
        path: '/',
        query: { redirect: to.fullPath }
      })
      
      // 显示提示消息
      setTimeout(() => {
        const notification = document.createElement('div')
        notification.className = 'notification neon-pink'
        notification.textContent = '您没有权限访问此页面'
        notification.style.cssText = `
          position: fixed;
          top: 90px;
          right: 20px;
          padding: 16px 28px;
          background: rgba(10, 10, 15, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid var(--cyber-neon-pink);
          border-radius: 8px;
          z-index: 10001;
          animation: slideInRight 0.3s ease;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        `
        document.body.appendChild(notification)

        setTimeout(() => {
          notification.style.animation = 'slideOutRight 0.3s ease'
          setTimeout(() => {
            if (document.body.contains(notification)) {
              document.body.removeChild(notification)
            }
          }, 300)
        }, 3000)
      }, 100)
      
      return
    }
  }
  
  // 允许访问
  next()
})

export default router

