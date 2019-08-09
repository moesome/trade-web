import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "layout" */ './views/Layout.vue'),
      children:[
        {
          path: '/users/login',
          name: 'login',
          component: () => import(/* webpackChunkName: "user" */ './views/user/Login.vue')
        },
        {
          path: '/users/create',
          name: 'users.create',
          component: () => import(/* webpackChunkName: "user" */ './views/user/Create.vue')
        },
        {
          path: '/users/:id/edit',
          name: 'users.edit',
          component: () => import(/* webpackChunkName: "user" */ './views/user/Edit.vue')
        },
        {
          path: '/commodities',
          name: 'commodities',
          component: () => import(/* webpackChunkName: "commodity" */ './views/commodity/Index.vue')
        },
        {
          path: '/orders',
          name: 'orders',
          component: () => import(/* webpackChunkName: "order" */ './views/order/Index.vue')
        },
        {
          path: '/commodities/manage',
          name: 'commodities.manage',
          component: () => import(/* webpackChunkName: "commodity" */ './views/commodity/Manage.vue')
        },
        {
          path: '/commodities/create',
          name: 'commodities.create',
          component: () => import(/* webpackChunkName: "commodity" */ './views/commodity/Create.vue')
        },
        {
          path: '/commodities/:id/edit',
          name: 'commodities.edit',
          component: () => import(/* webpackChunkName: "commodity" */ './views/commodity/Edit.vue')
        },
        {
          path: '/commodities/detail/:id',
          name: 'commodities.detail',
          component: () => import(/* webpackChunkName: "commodity" */ './views/commodity/Detail.vue')
        },
        {
          path: '/',
          name: 'home',
          component: () => import(/* webpackChunkName: "commodity" */ './views/Home.vue')
        },
        {
          path: '/gift',
          name: 'gift',
          component: () => import(/* webpackChunkName: "commodity" */ './views/gift/Gift.vue')
        },
        {
          path: '/account',
          name: 'account',
          component: () => import(/* webpackChunkName: "commodity" */ './views/user/Account.vue')
        },
      ]
    },
  ]
})
