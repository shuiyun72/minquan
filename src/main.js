// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'

// 引入axios，并加到原型链中
import axios from 'axios';
axios.defaults.baseURL = 'static/api'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded format';
Vue.prototype.$axios = axios;
import QS from 'qs'
Vue.prototype.qs = QS;


Vue.use(ElementUI);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
