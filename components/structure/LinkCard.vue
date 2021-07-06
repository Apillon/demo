<template>
  <nuxt-link
    v-if="to"
    :to="to"
    class="link-card"
  >
    <custom-card>
      <h4 class="">{{ title }}</h4>
      <p>{{ subtitle }}</p>
    </custom-card>
  </nuxt-link>
</template>
  
<script lang="ts">
import Vue from 'vue';
import CustomCard from '~/components/structure/CustomCard.vue';

export default Vue.extend({
  components: {
    CustomCard,
  },

  props: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    to: { type: String, default: '', required: true },
  },
});
</script>

<style lang="scss" scoped>
@import '~assets/sass/variables';

.link-card {
  text-align: center;
  display: block;
  margin-top: 3rem;

  h4 {
    color: $secondary;
    margin-bottom: 0.75rem;
    margin-top: 0.75rem;
  }

  p {
    color: $black;
    font-weight: 400;
    margin-bottom: 0;
  }

  .demo-card {
    border: solid 2px transparent;
    transition: border-color 0.15s ease-in-out;
  }

  &:hover, &:focus, &:active {
    text-decoration: none;

    .demo-card {
      border-color: $primary-transparent;
    }
  }

  @media (min-width: 576px) {
    margin-top: 6rem;

    h4 {
      margin-top: 0;
    }
  }
}
</style>
