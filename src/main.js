// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import MyAxios from '@/assets/js/myaxios.js'
import '../node_modules/element-ui/lib/theme-chalk/index.css'
import '@/assets/css/reset.css'
Vue.use(ElementUI)
Vue.use(MyAxios)
// 在生产环境下不需要设置一些提示 / 警告
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
