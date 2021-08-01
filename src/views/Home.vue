<template>
  <div class="home" v-if="!loggedIn">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import { authComputed } from '@/store/helpers.js'
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  computed: {
    ...authComputed
  }
}
</script>
