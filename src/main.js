// import Vue from 'vue'
// import App from './App.vue'

// Vue.config.productionTip = false

// new Vue({
//   render: h => h(App),
// }).$mount('#app')
 
import DkSelect from './components/DkSelect.vue'
// import './assets/css/common.css';

const components = [
  DkSelect
];

const install = function(Vue) { 
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  DkSelect
}