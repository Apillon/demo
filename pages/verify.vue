<template>
  <div>
    <custom-card
      v-if="!responseData.createdAt"
      title="Verify data integrity"
      subtitle="Check data for authenticity and verify it against blockchain records."
    >
      <verify-data @updated="responseData = $event" />
    </custom-card>

    <template v-else>
      <integrity-overview :data="responseData" />

      <div class="text-center">
        <!-- Open manual verify -->
        <b-button
          v-if="responseData.txid && !isDetailsOpen"
          variant="primary"
          size="sm"
          class="d-block d-md-inline-block mb-2 mb-md-0 mx-auto"
          @click="handleValidateData()"
        >
          View details for manual check
        </b-button>

        <!-- Go next -->
        <b-button
          variant="outline-primary"
          size="sm"
          @click="clearData()"
        >
          Verify more data
        </b-button>
      </div>
    </template>

    <custom-card
      v-if="isDetailsOpen"
      id="second-step"
      title="Verify data manually"
      subtitle="Use details below to manually check data integrity on the Moonbeam blockchain."
      class="mt-5"
    >
      <validate-data :validate-data="responseData.deepResponseData" />
    </custom-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CustomCard from '~/components/CustomCard.vue';
import VerifyData from '~/components/VerifyData.vue';
import ValidateData from '~/components/ValidateData.vue';
import IntegrityOverview from '~/components/IntegrityOverview.vue';

export default Vue.extend({
  components: {
    CustomCard,
    VerifyData,
    ValidateData,
    IntegrityOverview,
  },

  data() {
    return {
      responseData: {
        createdAt: '',
        txid: '',
      } as any,
      isDetailsOpen: false,
    };
  },

  methods: {
    clearData() {
      this.isDetailsOpen = false;
      this.responseData = { createdAt: '', txid: '' };
    },

    handleValidateData (data: any) {
      this.isDetailsOpen = true;
      if (process.browser && !!this.responseData.deepResponseData) {
        this.$nextTick(() => {
          const VueScrollTo = require('vue-scrollto');
          const element = document.getElementById('second-step');
          VueScrollTo.scrollTo(element, 1000, { offset: -100 });
        });
      }
    }
  }
})
</script>
