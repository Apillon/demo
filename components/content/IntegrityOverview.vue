<template>
  <div class="integrity-overview">
    <!-- Integrity guaranteed~! -->
    <custom-card class="integrity-overview-card" px="2rem" py="1rem">
      <div class="text-center my-3">
        <template v-if="data.verified">
          <b-img src="/img/at-checkmark.svg" width="36" height="31" fluid class="mb-3" />
          <h4 class="text-primary mb-4">{{ title || 'Integrity confirmed' }}</h4>
        </template>
        <template v-else>
          <b-img src="/img/at-close.svg" width="36" height="31" fluid class="mb-3" />
          <h4 class="text-primary mb-4">{{ title || 'Integrity compromised' }}</h4>
        </template>
      </div>

      <!-- ID -->
      <p v-if="!verify && data.id">
        <span>
          <span class="label">ID</span>
          <span>{{ data.id }}</span>
        </span>
      </p>

      <!-- Tag -->
      <p v-if="data.tag">
        <span>
          <span class="label">Tag</span>
          <span>{{ data.tag }}</span>
        </span>

        <b-button
          class="btn-clipboard ml-1"
          variant="outline-primary"
          v-b-tooltip.ds500 :title="clipboardText"
          @click="copyToClipboard(data.tag)"
        >
          <b-icon icon="files" />
        </b-button>
      </p>

      <!-- Hash -->
      <p v-if="!verify && data.hash">
        <span>
          <span class="label">Hash</span>
          <span>{{ data.hash }}</span>
        </span>
      </p>

      <!-- TXID -->
      <p v-if="verify">
        <span>
          <span class="label">Transaction ID</span>

          <a
            v-if="data.txid"
            :href="`https://moonbase.moonscan.io/tx/${data.txid}`"
            target="_blank"
            v-b-tooltip.ds500 title="Open transaction"
          >
            {{ data.txid }}
          </a>

          <span v-else>
            Not yet anchored
            <b-spinner variant="primary" small class="ml-1" style="margin-bottom: 2px;" />
          </span>
        </span>
      </p>

      <p v-if="data.createdAt">
        <span
          class="label d-inline-block"
          v-b-tooltip.bottom.ds500 :title="data.createdAt"
        >
          @ {{ data.createdAt | formatDate }}
        </span>
      </p>
    </custom-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CustomCard from '~/components/structure/CustomCard.vue';

export default Vue.extend({
  components: {
    CustomCard,
  },

  props: {
    data: { 
      type: Object, 
        default: () => ({
          id: '',
          tag: '',
          hash: '',
          txid: '',
          verified: true,
          createdAt: '',
        }
      ),
      required: true,
    },
    verify: { type: Boolean, default: false }, // show fields for verify ;else show fields for create
    title: { type: String, default: '' }, // overwrite default title (integrity confirmed/compromised)
  },

  data() {
    return {
      clipboardText: 'Copy to clipboard',
    };
  },

  methods: {
    copyToClipboard (text: string) {
      if (process.browser) {
        this.clipboardText = 'Copied!';
        setTimeout(() => { this.clipboardText = 'Copy to clipboard'; }, 5000);
        navigator.clipboard.writeText(text);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@import '~assets/sass/variables';

.integrity-overview {
  .integrity-overview-card {
    max-width: $tight-width;
    margin: 0 auto 2rem;
  }

  .label {
    color: $gray-500;
    display: block;
    font-size: 0.875rem;
    line-height: 1;
  }

  p {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
    word-break: break-word;
    word-wrap: break-word;
  }
}
</style>
