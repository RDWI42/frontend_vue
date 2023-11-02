import { createRouter, createWebHistory } from 'vue-router'


const routes = [

  {
    path: '/',
    name: 'home',
    component: () => import('../views/v_home.vue')
  },
  {
    path: '/tambah',
    name: 'tambah',
    component: () => import('../views/v_tambah_edit.vue')
  },
  {
    path: '/edit/:slug',
    name: 'edit',
    component: () => import('../views/v_tambah_edit.vue')
  },
  {
    path: '/lihat/:slug',
    name: 'lihat',
    component: () => import('../views/v_lihat.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
