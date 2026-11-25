<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: number
    readonly?: boolean
  }>(),
  { readonly: false },
)

const emit = defineEmits<{ (e: 'update:modelValue', value: number): void }>()

const setRating = (value: number) => {
  if (props.readonly) return
  emit('update:modelValue', value)
}
</script>

<template>
  <span class="stars" :class="{ 'stars--interactive': !readonly }">
    <span
      v-for="star in 5"
      :key="star"
      class="star"
      role="button"
      :aria-label="`${star}`"
      @click="setRating(star)"
    >{{ star <= modelValue ? '★' : '☆' }}</span>
  </span>
</template>

<style scoped>
.stars {
  font-size: 1.2rem;
  color: #f5a623;
}
.stars--interactive .star {
  cursor: pointer;
}
</style>
