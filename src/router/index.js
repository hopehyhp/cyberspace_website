import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import PersonalIntro from '../views/PersonalIntro.vue'
import MessageBoard from '../views/MessageBoard.vue'
import Entertainment from '../views/Entertainment.vue'
import Gomoku3x3 from '../views/games/Gomoku3x3.vue'
import GuessNumber from '../views/games/GuessNumber.vue'
import Tetris from '../views/games/Tetris.vue'
import GuessIdiom from '../views/games/GuessIdiom.vue'

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
  {
    path: '/entertainment/guess-idiom',
    name: 'GuessIdiom',
    component: GuessIdiom
  },
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

export default router

