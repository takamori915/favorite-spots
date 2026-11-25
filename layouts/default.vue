<script setup lang="ts">
const user = useSupabaseUser()
const { signOut } = useAuth()

const handleSignOut = async () => {
  await signOut()
  await navigateTo('/')
}
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <NuxtLink to="/" class="brand">お気に入りスポット</NuxtLink>
      <nav class="nav">
        <NuxtLink to="/favorites/new">投稿する</NuxtLink>
        <template v-if="user">
          <NuxtLink to="/mypage">マイページ</NuxtLink>
          <button class="link-button" @click="handleSignOut">ログアウト</button>
        </template>
        <template v-else>
          <NuxtLink to="/login">ログイン</NuxtLink>
          <NuxtLink to="/signup">新規登録</NuxtLink>
        </template>
      </nav>
    </header>
    <main class="app-main">
      <slot />
    </main>
  </div>
</template>
