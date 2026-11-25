<script setup lang="ts">
import type { Category } from '~/composables/useFavorites'

definePageMeta({ middleware: 'auth' })

const { fetchCategories, createFavorite } = useFavorites()

const { data: categories } = await useAsyncData<Category[]>('new-favorite-categories', () =>
  fetchCategories(),
)

const categoryId = ref('')
const title = ref('')
const googleMapUrl = ref('')
const memo = ref('')
const errorMessage = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  errorMessage.value = ''
  loading.value = true
  try {
    const favorite = await createFavorite({
      category_id: categoryId.value,
      title: title.value,
      google_map_url: googleMapUrl.value,
      memo: memo.value || undefined,
    })
    await navigateTo(`/favorites/${favorite.id}`)
  } catch (e) {
    errorMessage.value = e instanceof Error ? e.message : '登録に失敗しました'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h1>お気に入りを登録</h1>

    <form class="form" @submit.prevent="handleSubmit">
      <label>
        カテゴリ
        <select v-model="categoryId" required>
          <option value="" disabled>選択してください</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </label>

      <label>
        タイトル
        <input v-model="title" type="text" required placeholder="例: 〇〇カフェ">
      </label>

      <label>
        GoogleマップURL
        <input v-model="googleMapUrl" type="url" required placeholder="https://maps.app.goo.gl/...">
        <span class="hint">Googleマップでスポットを開き、共有リンクをコピーして貼り付けてください。</span>
      </label>

      <label>
        メモ
        <textarea v-model="memo" placeholder="おすすめポイントなど"></textarea>
      </label>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <button class="btn" type="submit" :disabled="loading">登録する</button>
    </form>
  </div>
</template>
