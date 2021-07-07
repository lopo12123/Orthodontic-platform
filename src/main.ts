import Vue from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'  // for ts
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { Message } from 'element-ui'

Vue.use(VueAxios, axios)
Vue.use(ElementUI)

Vue.prototype.$message = Message

Vue.axios.defaults.withCredentials = true

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
