import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import 'amfe-flexible'
import { qlog } from './utils/common'

// import 'default-passive-events' // 解决警告[Violation] Added non-passive event listener xxx

import { Toast } from 'vant'
import 'vant/es/toast/style'
import 'vant/lib/index.css' // 临时 css全引入

// 创建vue实例
const app = createApp(App)
app.use(store)
app.use(router)
app.use(Toast)
app.component(Toast.name, Toast)

declare global {
  interface Window {
    QscP: any
    qlog: any
  }
}
window.addEventListener('touchmove', () => {}, { passive: false })
window.addEventListener('mousewheel', () => {}, { passive: false })

window.QscP = window.QscP || {}

// 公共log 开发环境
window.qlog = qlog
app.config.globalProperties.qlog = qlog

router.beforeEach((to) => {
  // title
  if (to?.meta?.requireAuth) {
    // checkLogin 拦截
  }
  window.document.title = String(to?.meta?.title || '')
})

// 挂载实例
app.mount('#app')
