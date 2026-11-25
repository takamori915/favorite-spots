<script setup lang="ts">
const { signInWithEmail, signInWithGoogle } = useAuth()
const route = useRoute()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const redirectTarget = computed(() => {
  const target = route.query.redirect
  return typeof target === 'string' ? target : '/'
})

const handleLogin = async () => {
  errorMessage.value = ''
  loading.value = true
  try {
    await signInWithEmail(email.value, password.value)
    await navigateTo(redirectTarget.value)
  } catch (e) {
    errorMessage.value = e instanceof Error ? e.message : 'ログインに失敗しました'
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  errorMessage.value = ''
  try {
    await signInWithGoogle()
  } catch (e) {
    errorMessage.value = e instanceof Error ? e.message : 'Googleログインに失敗しました'
  }
}
</script>

<template>
  <div>
    <h1>ログイン</h1>
    <form class="form" @submit.prevent="handleLogin">
      <label>
        メールアドレス
        <input v-model="email" type="email" required autocomplete="email">
      </label>
      <label>
        パスワード
        <input v-model="password" type="password" required autocomplete="current-password">
      </label>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <button class="btn" type="submit" :disabled="loading">ログイン</button>
    </form>

    <div class="divider">または</div>

    <button class="btn btn-secondary" type="button" @click="handleGoogleLogin">
      Googleでログイン
    </button>

    <p class="hint">
      アカウントをお持ちでない方は <NuxtLink to="/signup">新規登録</NuxtLink>
    </p>
  </div>
</template>

<style scoped>
.divider {
  margin: 1.2rem 0;
  color: #999;
  font-size: 0.85rem;
}
</style>
