<template>
  <div>
    <transition-group name="fade">
      <custom-card
        v-if="!responseData.createdAt"
        key="form"
        title="Verify data integrity"
        subtitle="Check data for authenticity and verify it against blockchain records."
        class="transition-absolute"
      >
        <verify-data @updated="responseData = $event" />
      </custom-card>

      <template v-else>
        <integrity-overview 
          key="overview"
          :data="responseData"
          verify
        />

        <div key="actions" class="text-center">
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
    </transition-group>

    <link-card
      to="/add"
      :title="!responseData.createdAt ? 'Want to add integrity to your data, instead?' : 'Or, add integrity to your data'"
      subtitle="Equip your data with integrity by hashing and anchoring it on blockchain."
      :tight="!!responseData.createdAt"
    />

    <div v-if="isDetailsOpen" class="mt-5 pt-5">
      <transition-group name="fade">
        <custom-card
          v-if="!isManualVerified"
          key="input2"
          id="second-step"
          title="Verify data manually"
          subtitle="Use details below to manually check data integrity on the Moonbeam blockchain."
          class="transition-absolute"
        >
          <validate-data
            :validate-data="responseData.deepResponseData"
            @updated="isManualVerified = !!$event"
          />
        </custom-card>

        <template v-else>
          <!-- Integrity guaranteed~! -->
          <integrity-overview 
            key="overview"
            :data="{ verified: true }"
          />

          <div key="actions" class="text-center">
            <b-button
              variant="outline-primary"
              size="sm"
              @click="clearManualData()"
            >
              Edit manual check
            </b-button>
          </div>
        </template>
      </transition-group>
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
      isManualVerified: false,
      isDetailsOpen: false,
    };
  },

  methods: {
    clearData() {
      this.isDetailsOpen = false;
      this.responseData = { createdAt: '', txid: '' };
    },

    clearManualData() {
      this.isManualVerified = false;
      this.handleValidateData(500);
    },

    handleValidateData(timeout = 0) {
      this.isDetailsOpen = true;
      if (process.browser && !!this.responseData.deepResponseData) {
        // Timeout because of transition ...
        setTimeout(() => {
          this.$nextTick(() => {
            const VueScrollTo = require('vue-scrollto');
            const element = document.getElementById('second-step');
            VueScrollTo.scrollTo(element, 1000, { offset: -100 });
          });
        }, timeout);
      }
    }
  }
})
</script>
