<template>
  <div>
    <div class="row mb-5 pt-5 d-flex">
      <h1 class="col-12 col-sm-6 mb-0">
        Demo
      </h1>

      <div class="col-12 col-sm-6 d-flex justify-content-end align-items-center">
        <b-button
          size="sm"
          variant="outline-primary"
          to="/verify"
        >
          Verify
        </b-button>
      </div>
    </div>

    <div class="bg-white shadow-purple rounded-lg p-4">
      <h3 class="mb-4">
        Enter data
      </h3>

      <create-data />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CreateData from '~/components/CreateData.vue';

export default Vue.extend({
  components: {
    CreateData
  }
});
</script>
