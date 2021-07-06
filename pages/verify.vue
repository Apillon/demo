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
      <integrity-overview :data="responseData" verify />

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

    <link-card
      to="/"
      :title="!responseData.createdAt ? 'Want to add integrity to your data, instead?' : 'Or, add integrity to your data'"
      subtitle="Equip your data with integrity by hashing and anchoring it on blockchain."
      :tight="!!responseData.createdAt"
    />

    <div v-if="isDetailsOpen" class="mt-5 pt-5">
      <custom-card
        id="second-step"
        title="Verify data manually"
        subtitle="Use details below to manually check data integrity on the Moonbeam blockchain."
      >
        <validate-data :validate-data="responseData.deepResponseData" />
      </custom-card>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CustomCard from '~/components/structure/CustomCard.vue';
import LinkCard from '~/components/structure/LinkCard.vue';
import VerifyData from '~/components/content/VerifyData.vue';
import ValidateData from '~/components/content/ValidateData.vue';
import IntegrityOverview from '~/components/content/IntegrityOverview.vue';

export default Vue.extend({
  components: {
    CustomCard,
    LinkCard,
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
