// vite.config.js
import { fileURLToPath, URL } from 'node:url'    // ← из node:url!
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default ({ mode }) => {
  // 1) читаем .env(.development/.production), а не data.env
  //    если хотите читать все переменные — используйте '' в третьем аргументе
  const env = loadEnv(mode, process.cwd(), '')

  return defineConfig({
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api': {
          // 2) берём URL из env, например "http://localhost:8080/api"
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
  })
}
