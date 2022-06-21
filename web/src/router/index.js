import * as VueRouter from 'vue-router'

import TemplateImport from '@/views/setting/TemplateImport'
import MyTemplate from '@/views/setting/MyTemplate'
import ProjectGenerate from '@/views/generate/ProjectGenerate'
import CodeGenerate from '@/views/generate/CodeGenerate'
const routes = [
  {
    path: '/templateImport',
    component: TemplateImport
  },
  {
    path: '/myTemplate',
    component: MyTemplate
  },
  {
    path: '/projectGenerate',
    component: ProjectGenerate
  },
  {
    path: '/codeGenerate',
    component: CodeGenerate
  },
]

const router = VueRouter.createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: VueRouter.createWebHashHistory(),
  routes, // `routes: routes` 的缩写
});

// router.beforeEach((to, from, next) => {
//   next()
// })

export default router;