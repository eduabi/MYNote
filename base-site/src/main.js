require('./common/style/index.scss');
import Vue from 'vue'
import App from './App.vue'
 
new Vue({
    el: '#app',
    render: h => h(App)
})
if (module.hot) {
    // 实现热更新
    module.hot.accept();
}