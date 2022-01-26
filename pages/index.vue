<template>
  <div class="page-selector">
    <b-button
      variant="primary"
      to="/add"
      class="btn-selector"
    >
      <h5 class="text-white">Add integrity</h5>
      <p class="text-white">Equip your data with integrity by hashing and anchoring it on blockchain</p>
    </b-button>

    <b-button
      variant="outline-primary"
      to="/verify"
      class="btn-selector"
    >
      <h5>Verify integrity</h5>
      <p>Check data for authenticity and verify it against blockchain records</p>
    </b-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
});
</script>

<style lang="scss" scoped>
@import '~assets/sass/variables';


.page-selector {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;

  .btn-selector {
    max-width: 330px;
    margin: 0.5rem 0;
    padding: 5.5rem 3rem;

    &.btn-primary {
      p, h5 {
        color: $white;
      }
    }

    &.btn-outline-primary {
      p, h5 {
        color: $primary;
      }

      &:hover {
        p, h5 {
          color: $white;
        }
      }
    }

    h5 {
      margin-bottom: 0.875rem;
    }

    p {
      font-weight: 400;
      margin-bottom: 0;
    }

    // btn width + container padding
    @media (min-width: 342px) {
      padding: 5.5rem 4rem;
    }

    @media (min-width: 576px) {
      margin: 0.5rem;
    }

    @media (min-width: 992px) {
      margin: 0 2rem;
    }
  }
}
</style>
