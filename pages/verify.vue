<template>
  <div>
    <custom-card
      title="Verify data integrity"
      subtitle="Check data for authenticity and verify it against blockchain records."
    >
      <verify-data @verified="handleValidateData($event)" />
    </custom-card>

    <custom-card
      v-if="validateData"
      id="second-step"
      title="Verify data manually"
      subtitle="Use details below to manually check data integrity on the Moonbeam blockchain."
    >
      <validate-data :validate-data="validateData" />
    </custom-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CustomCard from '~/components/CustomCard.vue';
import VerifyData from '~/components/VerifyData.vue';
import ValidateData from '~/components/ValidateData.vue';

export default Vue.extend({
  components: {
    CustomCard,
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
