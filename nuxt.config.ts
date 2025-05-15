// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  debug: true,
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui'
  ],
  ui: {
    fonts: false
  },
  css: ['~/assets/css/main.css'],
  
  // Используем в Nuxt 3 для загрузки .env файлов
  nitro: {
    preset: 'node'
  },
  
  runtimeConfig: {
    // Секретные переменные, доступные только на сервере
    // Можно получить доступ через useRuntimeConfig() в composables
    
    // Публичные переменные, доступные и на клиенте и на сервере
    public: {
      wordpressApiUrl: process.env.WORDPRESS_API_URL,
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      photoBase: process.env.NUXT_PUBLIC_PHOTO_BASE
    }
  }
})