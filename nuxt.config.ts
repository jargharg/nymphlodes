// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  modules: ['@nuxt/image', '@nuxtjs/tailwindcss', '@nuxt/eslint', '@pinia/nuxt'],

  css: ['~/assets/css/main.scss'],

  app: {
    head: {
      title: 'Nymph Lodes',
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },

      ],
    },
  },

  pinia: {
    storesDirs: ['~/stores/**'],
  },
})
