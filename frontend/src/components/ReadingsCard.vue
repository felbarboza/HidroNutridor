
<template>
  <v-card>
    <v-card-title>{{ reading.title }}</v-card-title>
    <v-card-text class="display-2">{{ reading.value }}</v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'ReadingsCard',
  props: {
    reading: {
      type: Object,
      required: true
    }
  }
}
</script>