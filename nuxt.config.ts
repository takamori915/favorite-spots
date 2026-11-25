// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/supabase'],

  supabase: {
    // ログイン必須ページはページ側で middleware: 'auth' を個別指定するため、
    // モジュールの自動リダイレクトは全ページ除外しておく(サイトの大半は未ログインでも閲覧可能なため)。
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/*'],
    },
  },

  runtimeConfig: {
    public: {
      // Google Maps Embed API(無料枠)のAPIキー。Places APIは課金・規約リスクがあるため使用しない。
      googleMapsEmbedApiKey: '',
    },
  },

  css: ['~/assets/css/main.css'],

  typescript: {
    strict: true,
  },
})
