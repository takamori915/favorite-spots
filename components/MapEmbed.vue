<script setup lang="ts">
// Google Places API は課金・規約リスクがあるため使用しない。
// 代わりに Maps Embed API (無料) の "search" モードでタイトルを検索キーワードとして埋め込み表示する。
const props = defineProps<{
  query: string
  mapUrl: string
}>()

const config = useRuntimeConfig()

const embedSrc = computed(() => {
  const apiKey = config.public.googleMapsEmbedApiKey
  if (!apiKey) return null
  return `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=${encodeURIComponent(props.query)}`
})
</script>

<template>
  <div class="map-embed-wrapper">
    <iframe
      v-if="embedSrc"
      class="map-embed"
      :src="embedSrc"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
    />
    <p v-else class="hint">
      地図プレビューを表示するには NUXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY を設定してください。
    </p>
    <a :href="mapUrl" target="_blank" rel="noopener noreferrer" class="btn btn-secondary map-link">
      Googleマップで開く
    </a>
  </div>
</template>

<style scoped>
.map-embed-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.map-link {
  align-self: flex-start;
}
</style>
