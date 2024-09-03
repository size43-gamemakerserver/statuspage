import { createApp } from 'vue'
import App from './App.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

createApp(App).mount('#app')
