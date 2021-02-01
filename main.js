import Vue from 'vue'
import App from './App'
import 'until/index.js'
// import './static/img/icon/iconfont.css'
//引入vuex
import store from './store'
Vue.prototype.$store = store

import lodash from 'lodash';
Vue.prototype._ = lodash;
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
