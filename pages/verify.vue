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
          to="/"
        >
          Enter data
        </b-button>
      </div>
    </div>

    <div class="bg-white shadow-purple rounded-lg p-4">
      <h3 class="mb-4">
        Verify data
      </h3>

      <verify-data @verified="handleValidateData($event)" />
    </div>

    <div
      v-if="validateData"
      id="second-step"
      class="bg-white shadow-purple rounded-lg p-4 mt-5"
    >
      <h3 class="mb-4">
        Manual verify
      </h3>

      <validate-data :validate-data="validateData" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import VerifyData from '~/components/VerifyData.vue';
import ValidateData from '~/components/ValidateData.vue';

export default Vue.extend({
  components: {
    VerifyData,
    ValidateData,
  },

  data() {
    return {
      validateData: '',
    };
  },

  methods: {
    handleValidateData (data: any) {
      this.validateData = data;
      if (process.browser && !!this.validateData) {
        this.$nextTick(() => {
          const VueScrollTo = require('vue-scrollto');
          const element = document.getElementById('second-step');
          VueScrollTo.scrollTo(element, 1000);
        });
      }
    }
  }
})
</script>
