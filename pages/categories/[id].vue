<script setup lang="ts">
import type { Category, Favorite } from '~/composables/useFavorites'

const route = useRoute()
const categoryId = route.params.id as string

const { fetchCategory, fetchFavoritesByCategory } = useFavorites()

const { data: category } = await useAsyncData<Category | null>(
  `category-${categoryId}`,
  () => fetchCategory(categoryId),
)

const { data: favorites, pending, error } = await useAsyncData<Favorite[]>(
  `favorites-${categoryId}`,
  () => fetchFavoritesByCategory(categoryId),
)
</script>

<template>
  <div>
    <NuxtLink to="/" class="back-link">← カテゴリ一覧へ</NuxtLink>
    <h1>{{ category?.name ?? 'カテゴリ' }}</h1>

    <p v-if="pending">読み込み中…</p>
    <p v-else-if="error" class="error-message">お気に入りの取得に失敗しました</p>
    <p v-else-if="!favorites?.length">このカテゴリにはまだお気に入りが登録されていません。</p>

    <div v-else class="card-list">
      <NuxtLink
        v-for="favorite in favorites"
        :key="favorite.id"
        :to="`/favorites/${favorite.id}`"
        class="card favorite-card"
      >
        <h2>{{ favorite.title }}</h2>
        <p v-if="favorite.memo" class="memo-preview">{{ favorite.memo }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.back-link {
  display: inline-block;
  margin-bottom: 0.8rem;
}
.favorite-card {
  color: #1a1a1a;
  display: block;
}
.favorite-card:hover {
  border-color: #1a73e8;
  text-decoration: none;
}
.favorite-card h2 {
  margin: 0 0 0.4rem;
  font-size: 1.05rem;
}
.memo-preview {
  margin: 0;
  color: #555;
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
