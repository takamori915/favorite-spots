<script setup lang="ts">
// メール確認リンク / Google OAuth のコールバック先ページ。
// @nuxtjs/supabase モジュールがリダイレクト時にセッションを確立してくれるので、
// ここではユーザー状態を監視してトップページへ遷移するだけでよい。
const user = useSupabaseUser()

watch(
  user,
  (value) => {
    if (value) {
      navigateTo('/')
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="confirm-page">
    <p>ログイン処理中です…</p>
    <p class="hint">
      自動的に移動しない場合は <NuxtLink to="/">トップページ</NuxtLink> へ進んでください。
    </p>
  </div>
</template>
