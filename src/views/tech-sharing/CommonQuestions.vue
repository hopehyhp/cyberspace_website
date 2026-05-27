<template>
  <div class="common-questions-page">
    <div class="page-header">
      <button class="back-button" @click="handleBack">
        <span class="back-icon">←</span>
        <span>{{ backButtonText }}</span>
      </button>
      <h1 class="page-title">
        <span class="neon-purple neon-glow">常见问题解析</span>
      </h1>
      <p class="page-subtitle">{{ pageSubtitle }}</p>
    </div>

    <!-- 分类卡片 -->
    <div v-if="!selectedCategory" class="categories-section">
      <div class="categories-grid">
        <div
          v-for="category in categories"
          :key="category.id"
          class="cyber-card category-card"
          @click="selectCategory(category.id)"
        >
          <div class="category-icon" :class="category.colorClass">{{ category.icon }}</div>
          <h3 class="category-title">{{ category.name }}</h3>
          <p class="category-desc">{{ category.desc }}</p>
          <div class="category-count">
            {{ getQuestionCount(category.id) }} 个问题
          </div>
        </div>
      </div>
    </div>

    <!-- 问题列表 -->
    <div v-else class="questions-section">
      <div class="questions-list">
        <div
          v-for="(item, index) in currentQuestions"
          :key="item.id"
          class="cyber-card question-item"
          @click="openAnswer(item)"
        >
          <span class="question-index neon-cyan">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="question-text">{{ item.question }}</span>
          <span class="view-icon">→</span>
        </div>
      </div>
    </div>

    <!-- 答案弹窗 -->
    <div
      v-if="activeQuestion"
      class="answer-modal-overlay"
      @click.self="closeAnswer"
    >
      <div class="answer-modal cyber-card">
        <div class="modal-header">
          <span class="modal-category" :class="currentCategoryColorClass">
            {{ currentCategoryName }}
          </span>
          <button class="close-btn" @click="closeAnswer">×</button>
        </div>
        <h2 class="modal-question">{{ activeQuestion.question }}</h2>
        <div class="modal-body">
          <p
            v-for="(paragraph, pIndex) in activeQuestion.answer"
            :key="pIndex"
            class="answer-paragraph"
          >
            {{ paragraph }}
          </p>
          <pre v-if="activeQuestion.code" class="code-block"><code>{{ activeQuestion.code }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommonQuestionsPage',
  data() {
    return {
      selectedCategory: null,
      activeQuestion: null,
      categories: [
        {
          id: 'vue',
          name: 'Vue',
          icon: '💚',
          desc: '组件、响应式、生命周期等 Vue 框架相关问题',
          colorClass: 'neon-green'
        },
        {
          id: 'javascript',
          name: 'JavaScript',
          icon: '⚡',
          desc: '作用域、异步、原型链等 JS 语言基础问题',
          colorClass: 'neon-cyan'
        },
        {
          id: 'typescript',
          name: 'TypeScript',
          icon: '🔷',
          desc: '类型系统、泛型、接口等 TS 类型相关问题',
          colorClass: 'neon-purple'
        }
      ],
      questionBank: {
        vue: [
          {
            id: 'vue-1',
            question: 'v-if 和 v-show 有什么区别？',
            answer: [
              'v-if 是「真正」的条件渲染：条件为 false 时，元素不会被渲染到 DOM 中；切换时会触发组件的创建与销毁。',
              'v-show 只是通过 CSS display 控制显示隐藏，元素始终存在于 DOM 中。',
              '频繁切换显示状态时，优先用 v-show（开销更小）；条件很少改变、或需要配合 v-else 时，用 v-if 更合适。'
            ]
          },
          {
            id: 'vue-2',
            question: 'computed 和 watch 有什么区别？',
            answer: [
              'computed 用于根据已有数据「派生」新值，有缓存：依赖不变时不会重新计算，适合模板中直接使用的计算结果。',
              'watch 用于监听某个数据变化后执行「副作用」逻辑，如发请求、操作 DOM、打印日志等。',
              '简单记忆：需要「算出一个值」用 computed；需要「数据变了之后做某事」用 watch。'
            ],
            code: `// computed：派生值
computed: {
  fullName() {
    return this.firstName + ' ' + this.lastName
  }
}

// watch：监听变化后执行逻辑
watch: {
  userId(newId) {
    this.fetchUserData(newId)
  }
}`
          },
          {
            id: 'vue-3',
            question: '为什么直接修改数组索引或对象新属性，视图不更新？',
            answer: [
              'Vue 2 的响应式基于 Object.defineProperty，无法检测「数组索引赋值」和「对象新增属性」。',
              '数组请使用 splice、push 等变异方法，或使用 Vue.set / this.$set。',
              '对象新增属性同样需要用 this.$set(obj, key, value) 才能触发视图更新。',
              'Vue 3 使用 Proxy，已能自动检测这类变化，但 Vue 2 项目中仍需注意上述写法。'
            ],
            code: `// ❌ 可能不触发更新
this.list[0] = 'new'
this.user.age = 18

// ✅ 推荐写法
this.$set(this.list, 0, 'new')
this.$set(this.user, 'age', 18)
this.list.splice(0, 1, 'new')`
          },
          {
            id: 'vue-4',
            question: '父子组件如何通信？',
            answer: [
              '父 → 子：通过 props 向子组件传递数据。',
              '子 → 父：子组件通过 $emit 触发事件，父组件在模板中监听。',
              '父组件需要调用子组件方法或访问数据时，可使用 ref 获取子组件实例。',
              '跨多层组件可用 provide / inject，或借助 Vuex / Pinia 等状态管理。'
            ],
            code: `<!-- 父组件 -->
<Child :msg="message" @update="handleUpdate" ref="child" />

<!-- 子组件 -->
props: ['msg'],
methods: {
  notifyParent() {
    this.$emit('update', newValue)
  }
}`
          },
          {
            id: 'vue-5',
            question: '列表渲染中 :key 有什么作用？',
            answer: [
              'key 帮助 Vue 识别每个节点的身份，在列表增删、重排时能高效复用 DOM，而不是盲目重新渲染。',
              'key 应使用唯一且稳定的值（如 id），不要用数组 index 作为 key（在列表顺序会变化时容易出 bug）。',
              '错误使用 key 可能导致输入框内容错位、组件状态混乱等问题。'
            ],
            code: `<!-- ✅ 使用唯一 id -->
<div v-for="item in list" :key="item.id">

<!-- ⚠️ 列表会排序/删除时，避免用 index -->
<div v-for="(item, index) in list" :key="index">`
          },
          {
            id: 'vue-6',
            question: 'mounted 和 created 生命周期有什么区别？',
            answer: [
              'created：实例创建完成，data、methods 已可用，但 DOM 尚未挂载，适合发请求、初始化数据。',
              'mounted：DOM 已挂载，可以访问 $el、操作 DOM、初始化第三方库（如图表、地图）。',
              '一般数据请求放在 created 即可；需要依赖 DOM 节点的逻辑放在 mounted。'
            ]
          },
          {
            id: 'vue-7',
            question: '$nextTick 是做什么的？',
            answer: [
              'Vue 更新 DOM 是异步的：数据变化后，DOM 不会立刻更新，而是等同一事件循环中的多次数据变更结束后批量更新。',
              '若在修改数据后立即操作 DOM，可能拿到的是更新前的旧内容。',
              'this.$nextTick(callback) 会在 DOM 更新完成后执行回调，确保能访问到最新的 DOM 状态。'
            ],
            code: `this.message = '新内容'
// 此时 DOM 可能还未更新
this.$nextTick(() => {
  console.log(this.$refs.text.innerText)
})`
          }
        ],
        javascript: [
          {
            id: 'js-1',
            question: 'var、let、const 有什么区别？',
            answer: [
              'var 存在变量提升，可在声明前访问（值为 undefined），且没有块级作用域。',
              'let 和 const 有块级作用域，不存在变量提升，在声明前访问会报错（暂时性死区）。',
              'const 声明的是常量引用，不能重新赋值；但对象/数组的内容仍可修改。',
              '实际开发中优先使用 const，需要重新赋值时用 let，避免使用 var。'
            ],
            code: `const user = { name: 'Tom' }
user.name = 'Jerry'  // ✅ 可以修改属性
// user = {}         // ❌ 不能重新赋值`
          },
          {
            id: 'js-2',
            question: '== 和 === 有什么区别？',
            answer: [
              '== 会进行类型转换后再比较，例如 1 == "1" 为 true。',
              '=== 严格相等，不会进行类型转换，类型不同直接返回 false。',
              '开发中应始终使用 === 和 !==，避免隐式类型转换带来的意外结果。'
            ]
          },
          {
            id: 'js-3',
            question: '什么是闭包？',
            answer: [
              '闭包是指函数能够「记住」并访问其词法作用域中的变量，即使函数在其作用域外执行。',
              '常见场景：数据私有化、工厂函数、防抖节流等。',
              '注意：闭包会持有外部变量的引用，不当使用可能导致内存无法释放。'
            ],
            code: `function createCounter() {
  let count = 0
  return function() {
    count++
    return count
  }
}
const counter = createCounter()
counter() // 1
counter() // 2`
          },
          {
            id: 'js-4',
            question: 'Promise 和 async/await 有什么关系？',
            answer: [
              'Promise 是异步编程的一种方案，代表一个将来才会结束的操作结果。',
              'async/await 是基于 Promise 的语法糖，让异步代码写起来像同步代码一样清晰。',
              'async 函数始终返回 Promise；await 会暂停函数执行，等待 Promise 完成后再继续。'
            ],
            code: `async function fetchData() {
  try {
    const res = await fetch('/api/data')
    const data = await res.json()
    return data
  } catch (err) {
    console.error(err)
  }
}`
          },
          {
            id: 'js-5',
            question: '事件循环（Event Loop）是什么？',
            answer: [
              'JavaScript 是单线程的，Event Loop 负责协调同步代码、微任务和宏任务的执行顺序。',
              '同步代码先执行；异步任务分为宏任务（setTimeout、setInterval 等）和微任务（Promise.then 等）。',
              '每轮循环：执行一个宏任务 → 清空所有微任务 → 可能渲染 → 进入下一轮。'
            ]
          }
        ],
        typescript: [
          {
            id: 'ts-1',
            question: 'TypeScript 和 JavaScript 的主要区别是什么？',
            answer: [
              'TypeScript 是 JavaScript 的超集，在 JS 基础上增加了静态类型系统。',
              'TS 代码需要编译为 JS 后才能运行，编译阶段就能发现类型错误。',
              'TS 提供了接口、泛型、枚举等特性，适合大型项目和团队协作。'
            ]
          },
          {
            id: 'ts-2',
            question: 'interface 和 type 有什么区别？',
            answer: [
              '两者都可以描述对象结构，大部分场景可以互换使用。',
              'interface 支持声明合并（同名 interface 会自动合并），type 不支持。',
              'type 更灵活，可以定义联合类型、交叉类型、元组等复杂类型。',
              '描述对象结构时优先 interface；需要联合类型或复杂类型组合时用 type。'
            ],
            code: `interface User {
  name: string
}

type Status = 'active' | 'inactive'
type ID = string | number`
          },
          {
            id: 'ts-3',
            question: 'any、unknown、never 分别是什么？',
            answer: [
              'any：关闭类型检查，可以赋任意值，应尽量避免使用。',
              'unknown：类型安全的 any，使用前必须先进行类型收窄（如 typeof、instanceof）。',
              'never：表示永远不会发生的值，常用于抛出错误的函数或 exhaustive check。'
            ],
            code: `let value: unknown = 'hello'
if (typeof value === 'string') {
  console.log(value.toUpperCase()) // ✅ 类型收窄后可用
}`
          },
          {
            id: 'ts-4',
            question: '泛型（Generics）有什么用？',
            answer: [
              '泛型让函数、类、接口在保持类型安全的同时具备复用性，避免使用 any 丢失类型信息。',
              '使用时传入具体类型参数，编译器会根据传入的类型进行推断和检查。',
              '常见场景：通用 API 响应包装、可复用的数据结构、工具函数等。'
            ],
            code: `function wrap<T>(value: T): { data: T } {
  return { data: value }
}

const num = wrap(42)       // { data: number }
const str = wrap('hello')  // { data: string }`
          },
          {
            id: 'ts-5',
            question: '可选属性和 readonly 怎么用？',
            answer: [
              '可选属性用 ? 标记，表示该属性可以不存在，例如 name?: string。',
              'readonly 标记的属性只能在初始化时赋值，之后不可修改。',
              'Partial<T> 可将所有属性变为可选；Readonly<T> 可将所有属性变为只读。'
            ],
            code: `interface Config {
  readonly id: string
  title: string
  desc?: string
}`
          }
        ]
      }
    }
  },
  computed: {
    currentQuestions() {
      if (!this.selectedCategory) return []
      return this.questionBank[this.selectedCategory] || []
    },
    currentCategory() {
      if (!this.selectedCategory) return null
      return this.categories.find(c => c.id === this.selectedCategory)
    },
    currentCategoryName() {
      return this.currentCategory ? this.currentCategory.name : ''
    },
    currentCategoryColorClass() {
      return this.currentCategory ? this.currentCategory.colorClass : ''
    },
    backButtonText() {
      return this.selectedCategory ? '返回分类' : '返回技术分享'
    },
    pageSubtitle() {
      if (!this.selectedCategory) {
        return '选择技术领域，查看常见问题与解答'
      }
      return `${this.currentCategoryName} 相关问题`
    }
  },
  methods: {
    getQuestionCount(categoryId) {
      return (this.questionBank[categoryId] || []).length
    },
    selectCategory(categoryId) {
      this.selectedCategory = categoryId
    },
    openAnswer(question) {
      this.activeQuestion = question
    },
    closeAnswer() {
      this.activeQuestion = null
    },
    handleBack() {
      if (this.selectedCategory) {
        this.selectedCategory = null
        this.activeQuestion = null
      } else {
        this.$router.push('/tech-sharing')
      }
    }
  }
}
</script>

<style scoped>
.common-questions-page {
  min-height: calc(100vh - 70px);
  padding: 20px 20px 60px;
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 40px;
  animation: fadeInDown 0.6s ease-out;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  margin-bottom: 24px;
  background: rgba(0, 217, 255, 0.05);
  border: 1px solid var(--cyber-glass-border);
  border-radius: 8px;
  color: var(--cyber-text-secondary);
  font-family: inherit;
  font-size: 0.95em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  color: var(--cyber-neon-cyan);
  border-color: var(--cyber-neon-cyan);
  background: rgba(0, 217, 255, 0.1);
}

.back-icon {
  font-size: 1.2em;
}

.page-title {
  font-size: 2.8em;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 12px;
}

.page-subtitle {
  color: var(--cyber-text-secondary);
  font-size: 1.1em;
  letter-spacing: 0.5px;
}

/* 分类卡片 */
.categories-section {
  animation: fadeInUp 0.8s ease-out 0.2s backwards;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.category-card {
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.category-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: var(--cyber-neon-cyan);
  box-shadow:
    var(--cyber-shadow-lg),
    0 0 30px rgba(0, 217, 255, 0.3);
}

.category-icon {
  font-size: 4em;
  margin-bottom: 20px;
  display: inline-block;
  filter: drop-shadow(0 0 20px currentColor);
  transition: transform 0.3s ease;
}

.category-card:hover .category-icon {
  transform: scale(1.1) rotate(5deg);
}

.category-title {
  font-size: 1.8em;
  margin-bottom: 12px;
  color: var(--cyber-text-primary);
  font-weight: 600;
}

.category-desc {
  color: var(--cyber-text-secondary);
  line-height: 1.6;
  margin-bottom: 16px;
  font-size: 0.95em;
}

.category-count {
  display: inline-block;
  padding: 6px 14px;
  font-size: 0.85em;
  color: var(--cyber-neon-cyan);
  border: 1px solid var(--cyber-glass-border);
  border-radius: 20px;
  background: rgba(0, 217, 255, 0.05);
}

/* 问题列表 */
.questions-section {
  max-width: 900px;
  margin: 0 auto;
  animation: fadeInUp 0.5s ease-out;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.question-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.question-item:hover {
  border-color: rgba(0, 217, 255, 0.4);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.1);
  transform: translateX(4px);
}

.question-index {
  flex-shrink: 0;
  font-size: 0.9em;
  font-weight: 700;
  opacity: 0.8;
}

.question-text {
  flex: 1;
  color: var(--cyber-text-primary);
  font-size: 1.05em;
  font-weight: 500;
  line-height: 1.5;
}

.view-icon {
  flex-shrink: 0;
  color: var(--cyber-neon-cyan);
  font-size: 1.2em;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.question-item:hover .view-icon {
  opacity: 1;
  transform: translateX(4px);
}

/* 答案弹窗 */
.answer-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  animation: fadeIn 0.25s ease;
}

.answer-modal {
  width: 100%;
  max-width: 680px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 0;
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--cyber-glass-border);
}

.modal-category {
  font-size: 0.85em;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.close-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--cyber-glass-border);
  border-radius: 8px;
  color: var(--cyber-text-secondary);
  font-size: 1.4em;
  cursor: pointer;
  transition: all 0.3s ease;
  line-height: 1;
}

.close-btn:hover {
  color: var(--cyber-neon-pink);
  border-color: var(--cyber-neon-pink);
  background: rgba(255, 0, 128, 0.1);
}

.modal-question {
  padding: 24px 24px 0;
  font-size: 1.4em;
  font-weight: 700;
  color: var(--cyber-text-primary);
  line-height: 1.5;
}

.modal-body {
  padding: 16px 24px 28px;
}

.answer-paragraph {
  color: var(--cyber-text-secondary);
  line-height: 1.8;
  margin: 12px 0 0;
  font-size: 0.98em;
}

.code-block {
  margin-top: 16px;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--cyber-glass-border);
  border-radius: 8px;
  overflow-x: auto;
  text-align: left;
}

.code-block code {
  color: var(--cyber-neon-green);
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.88em;
  line-height: 1.6;
  white-space: pre;
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
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
  .common-questions-page {
    padding: 20px 16px 40px;
  }

  .page-title {
    font-size: 2em;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }

  .question-item {
    padding: 16px;
    gap: 12px;
  }

  .question-text {
    font-size: 1em;
  }

  .modal-question {
    font-size: 1.2em;
    padding: 20px 20px 0;
  }

  .modal-body {
    padding: 12px 20px 24px;
  }

  .code-block code {
    font-size: 0.82em;
  }
}
</style>
