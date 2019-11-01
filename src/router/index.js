import Vue from 'vue'
import Router from 'vue-router'
import Create from '@/components/Create'
import List from '@/components/List'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Create',
      component: Create
    },
    {
      path: '/list',
      name: 'List',
      component: List
    }
  ]
})
