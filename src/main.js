import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import {useUserStore} from "@/stores/user.js";
import '@/assets/base.css'
import '@/assets/common_styles.css'

async function bootstrap() {
    const app = createApp(App)
    const pinia = createPinia()
    app.use(pinia)
    app.use(router)

    const userStore = useUserStore(pinia)
    await userStore.init()

    app.mount('#app')
}

bootstrap()
