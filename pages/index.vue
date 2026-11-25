<script setup lang="ts">
import type { Category } from '~/composables/useFavorites'

const { fetchCategories } = useFavorites()

const { data: categories, pending, error } = await useAsyncData<Category[]>(
  'categories',
  () => fetchCategories(),
)
</script>

<template>
  <div>
    <h1>カテゴリ一覧</h1>
    <p class="hint">気になるカテゴリを選んで、みんなのお気に入りスポットをチェックしよう。</p>

    <p v-if="pending">読み込み中…</p>
    <p v-else-if="error" class="error-message">カテゴリの取得に失敗しました</p>
    <p v-else-if="!categories?.length">まだカテゴリが登録されていません。</p>

    <div v-else class="card-list">
      <NuxtLink
        v-for="category in categories"
        :key="category.id"
        :to="`/categories/${category.id}`"
        class="card category-card"
      >
        {{ category.name }}
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.category-card {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  min-height: 80px;
  text-align: center;
  color: #1a1a1a;
}
.category-card:hover {
  border-color: #1a73e8;
  text-decoration: none;
}
</style>
