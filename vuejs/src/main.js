import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import Vuelidate from 'vuelidate'

Vue.use(Vuelidate)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  mounted() {
    window.addEventListener('keyup', function(event) {
      if (event.keyCode === 27) { 
        store.dispatch('setKeyUpEsc')
      }
    });
  },
  render: h => h(App)
}).$mount('#app')
