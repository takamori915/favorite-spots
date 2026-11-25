<script setup lang="ts">
import type { Favorite } from '~/composables/useFavorites'
import type { Review } from '~/composables/useReviews'

const route = useRoute()
const favoriteId = route.params.id as string

const user = useSupabaseUser()
const { fetchFavorite, deleteFavorite } = useFavorites()
const { fetchReviewsByFavorite, createReview, updateReview, deleteReview, averageRating } = useReviews()

const { data: favorite, error: favoriteError } = await useAsyncData<Favorite | null>(
  `favorite-${favoriteId}`,
  () => fetchFavorite(favoriteId),
)

const { data: reviews, refresh: refreshReviews } = await useAsyncData<Review[]>(
  `reviews-${favoriteId}`,
  () => fetchReviewsByFavorite(favoriteId),
)

const average = computed(() => averageRating(reviews.value ?? []))
const myReview = computed(() => reviews.value?.find((r) => r.user_id === user.value?.id) ?? null)
const isOwner = computed(() => favorite.value?.user_id === user.value?.id)

const rating = ref(5)
const comment = ref('')
const submitting = ref(false)
const reviewError = ref('')

watchEffect(() => {
  if (myReview.value) {
    rating.value = myReview.value.rating
    comment.value = myReview.value.comment ?? ''
  }
})

const handleSubmitReview = async () => {
  reviewError.value = ''
  submitting.value = true
  try {
    if (myReview.value) {
      await updateReview(myReview.value.id, { rating: rating.value, comment: comment.value || undefined })
    } else {
      await createReview({ favorite_id: favoriteId, rating: rating.value, comment: comment.value || undefined })
    }
    await refreshReviews()
  } catch (e) {
    reviewError.value = e instanceof Error ? e.message : '口コミの投稿に失敗しました'
  } finally {
    submitting.value = false
  }
}

const handleDeleteReview = async () => {
  if (!myReview.value) return
  submitting.value = true
  try {
    await deleteReview(myReview.value.id)
    rating.value = 5
    comment.value = ''
    await refreshReviews()
  } finally {
    submitting.value = false
  }
}

const handleDeleteFavorite = async () => {
  if (!favorite.value) return
  if (!confirm('このお気に入りを削除しますか?')) return
  await deleteFavorite(favorite.value.id)
  await navigateTo(`/categories/${favorite.value.category_id}`)
}
</script>

<template>
  <div v-if="favoriteError">
    <p class="error-message">お気に入りが見つかりませんでした。</p>
  </div>

  <div v-else-if="favorite">
    <NuxtLink :to="`/categories/${favorite.category_id}`" class="back-link">
      ← {{ favorite.categories?.name ?? 'カテゴリ' }}へ戻る
    </NuxtLink>

    <div class="card">
      <div class="favorite-header">
        <h1>{{ favorite.title }}</h1>
        <div class="stars-row">
          <StarRating :model-value="Math.round(average)" readonly />
          <span class="hint">{{ average || '評価なし' }} ({{ reviews?.length ?? 0 }}件)</span>
        </div>
      </div>

      <p v-if="favorite.memo" class="memo">{{ favorite.memo }}</p>

      <MapEmbed :query="favorite.title" :map-url="favorite.google_map_url" />

      <button v-if="isOwner" class="btn btn-danger delete-btn" @click="handleDeleteFavorite">
        削除する
      </button>
    </div>

    <section class="reviews-section">
      <h2>口コミ ({{ reviews?.length ?? 0 }}件)</h2>

      <div v-if="user" class="card review-form">
        <h3>{{ myReview ? '口コミを編集' : '口コミを投稿' }}</h3>
        <form class="form" @submit.prevent="handleSubmitReview">
          <label>
            評価
            <StarRating v-model="rating" />
          </label>
          <label>
            コメント
            <textarea v-model="comment" placeholder="感想を書いてください"></textarea>
          </label>
          <p v-if="reviewError" class="error-message">{{ reviewError }}</p>
          <div class="review-form-actions">
            <button class="btn" type="submit" :disabled="submitting">
              {{ myReview ? '更新する' : '投稿する' }}
            </button>
            <button
              v-if="myReview"
              class="btn btn-secondary"
              type="button"
              :disabled="submitting"
              @click="handleDeleteReview"
            >
              削除する
            </button>
          </div>
        </form>
      </div>
      <p v-else class="hint">
        口コミを投稿するには <NuxtLink :to="`/login?redirect=/favorites/${favoriteId}`">ログイン</NuxtLink> してください。
      </p>

      <ul class="review-list">
        <li v-for="review in reviews" :key="review.id" class="card review-item">
          <StarRating :model-value="review.rating" readonly />
          <p v-if="review.comment">{{ review.comment }}</p>
          <p class="hint">{{ new Date(review.created_at).toLocaleDateString('ja-JP') }}</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.back-link {
  display: inline-block;
  margin-bottom: 0.8rem;
}
.favorite-header {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 0.8rem;
}
.stars-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.memo {
  white-space: pre-wrap;
  margin-bottom: 1rem;
}
.delete-btn {
  margin-top: 1rem;
}
.reviews-section {
  margin-top: 2rem;
}
.review-form-actions {
  display: flex;
  gap: 0.6rem;
}
.review-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
}
.review-item p {
  margin: 0.4rem 0 0;
}
</style>
