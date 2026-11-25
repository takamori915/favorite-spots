<script setup lang="ts">
const { signUpWithEmail, signInWithGoogle } = useAuth()

const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const errorMessage = ref('')
const loading = ref(false)
const done = ref(false)

const handleSignUp = async () => {
  errorMessage.value = ''

  if (password.value !== passwordConfirm.value) {
    errorMessage.value = 'パスワードが一致しません'
    return
  }
  if (password.value.length < 6) {
    errorMessage.value = 'パスワードは6文字以上で入力してください'
    return
  }

  loading.value = true
  try {
    await signUpWithEmail(email.value, password.value)
    done.value = true
  } catch (e) {
    errorMessage.value = e instanceof Error ? e.message : '登録に失敗しました'
  } finally {
    loading.value = false
  }
}

const handleGoogleSignUp = async () => {
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
    <h1>新規登録</h1>

    <div v-if="done" class="card">
      <p>確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。</p>
      <NuxtLink to="/login">ログインページへ</NuxtLink>
    </div>

    <template v-else>
      <form class="form" @submit.prevent="handleSignUp">
        <label>
          メールアドレス
          <input v-model="email" type="email" required autocomplete="email">
        </label>
        <label>
          パスワード
          <input v-model="password" type="password" required minlength="6" autocomplete="new-password">
        </label>
        <label>
          パスワード(確認)
          <input v-model="passwordConfirm" type="password" required minlength="6" autocomplete="new-password">
        </label>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <button class="btn" type="submit" :disabled="loading">登録する</button>
      </form>

      <div class="divider">または</div>

      <button class="btn btn-secondary" type="button" @click="handleGoogleSignUp">
        Googleで登録
      </button>

      <p class="hint">
        すでにアカウントをお持ちの方は <NuxtLink to="/login">ログイン</NuxtLink>
      </p>
    </template>
  </div>
</template>

<style scoped>
.divider {
  margin: 1.2rem 0;
  color: #999;
  font-size: 0.85rem;
}
</style>
