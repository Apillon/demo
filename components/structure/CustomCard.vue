<template>
  <div 
    class="demo-card shadow-purple rounded-lg"
    :style="{
      'padding-left': px,
      'padding-right': px,
      'padding-top': py,
      'padding-bottom': py
    }"
  >
    <div v-if="title || subtitle" class="mb-5 mt-3 mt-md-0">
      <h1 v-if="title" :class="{'mb-3': !!subtitle}">
        {{ title }}
      </h1>

      <p v-if="subtitle">
        {{ subtitle }}
      </p>
    </div>

    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    px: { type: String, default: '3.5rem' }, // horizontal padding
    py: { type: String, default: '2.5rem' }, // vertical padding
    // pxMobile: { type: String, default: '0.75rem' },
    // pyMobile: { type: String, default: '0.75rem' },
  },
});
</script>

<style lang="scss" scoped>
@import '~assets/sass/variables';

.demo-card {
  background-color: $white;
}

@media (max-width: 575px) {
  .demo-card {
    padding: 0.75rem !important;
    padding-bottom: 1.5rem !important;
  }
}
</style>
