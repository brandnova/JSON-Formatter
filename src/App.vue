<script setup>
import Validator from './components/Validator.vue'
</script>

<template>
  <div class="flex flex-row w-full justify-center mb-5">
    <img src="../public/jsonvalidator.svg" class="logo validator text-xl" alt="validator logo" />
  </div>
  <Validator />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo.validator:hover {
  filter: drop-shadow(0 0 2em #121413aa);
}
</style>
