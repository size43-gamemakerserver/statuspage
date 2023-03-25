import Vue from 'vue'
import App from './App.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

Vue.config.productionTip = false

Vue.filter("cpu", function (value) {
    return (value * 100).toFixed(1);
});

Vue.filter("twoDigits", function (value) {
  return (value * 1).toFixed(2);
});

Vue.filter("relativeTime", function (date) {
    return dayjs(date).fromNow();
});

new Vue({
    render: h => h(App),
}).$mount('#app')
