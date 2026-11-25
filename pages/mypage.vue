<script setup lang="ts">
import type { Favorite } from '~/composables/useFavorites'

definePageMeta({ middleware: 'auth' })

const user = useSupabaseUser()
const { fetchMyFavorites, deleteFavorite } = useFavorites()

const { data: favorites, refresh } = await useAsyncData<Favorite[]>('my-favorites', () =>
  user.value ? fetchMyFavorites(user.value.id) : Promise.resolve([]),
)

const handleDelete = async (favorite: Favorite) => {
  if (!confirm(`「${favorite.title}」を削除しますか?`)) return
  await deleteFavorite(favorite.id)
  await refresh()
}
</script>

<template>
  <div>
    <h1>マイページ</h1>
    <p class="hint">{{ user?.email }}</p>

    <h2>登録したお気に入り</h2>
    <p v-if="!favorites?.length">まだお気に入りを登録していません。</p>

    <ul v-else class="my-favorite-list">
      <li v-for="favorite in favorites" :key="favorite.id" class="card my-favorite-item">
        <div>
          <NuxtLink :to="`/favorites/${favorite.id}`">{{ favorite.title }}</NuxtLink>
          <p class="hint">{{ favorite.categories?.name }}</p>
        </div>
        <button class="btn btn-danger" @click="handleDelete(favorite)">削除</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.my-favorite-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.my-favorite-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
</style>
