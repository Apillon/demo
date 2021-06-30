<template>
  <div>
    <h1 class="mb-5">
      Demo
    </h1>

    <div class="bg-white shadow-purple rounded-lg p-075 p-sm-4 pb-4">
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
