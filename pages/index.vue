<template>
  <div>
    <transition-group name="fade">
      <custom-card
        v-if="!responseData.createdAt"
        key="form"
        title="Add integrity"
        subtitle="Equip your data with integrity by hashing and anchoring it on blockchain."
        class="transition-absolute"
      >
        <create-data @updated="responseData = $event" />
      </custom-card>

      <template v-else>
        <integrity-overview
          key="overview"
          :data="responseData"
          title="Integrity guaranteed"
        />
        
        <!-- Go next -->
        <div key="actions" class="text-center">
          <b-button
            variant="primary"
            size="sm"
            class="m-2"
            @click="downloadData()"
          >
            Download trusted data
          </b-button>

          <b-button
            variant="outline-primary"
            size="sm"
            class="m-2"
            @click="clearData()"
          >
            Add integrity to more data
          </b-button>
        </div>
      </template>
    </transition-group>

    <link-card
      to="/verify"
      :title="!responseData.createdAt ? 'Want to verify data integrity instead?' : 'Next, verify your data'"
      subtitle="Check data for authenticity and verify it against blockchain records."
      :tight="!!responseData.createdAt"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CustomCard from '~/components/structure/CustomCard.vue';
import LinkCard from '~/components/structure/LinkCard.vue';
import CreateData from '~/components/content/CreateData.vue';
import IntegrityOverview from '~/components/content/IntegrityOverview.vue';

export default Vue.extend({
  components: {
    CustomCard,
    LinkCard,
    CreateData,
    IntegrityOverview
  },

  data() {
    return {
      responseData: {
        createdAt: '',
      } as any,
    };
  },

  methods: {
    clearData() {
      this.responseData = { createdAt: '' };
    },

    /**
     * Download a txt file with verification info for later reference
     */
    downloadData() {
      let text = `Tag: ${this.responseData.tag}\n`;
      text = text + `Hash: ${this.responseData.hash}\n`;
      text = text + `Date: ${new Date(this.responseData.createdAt).toISOString()}\n`;

      if (this.responseData.document) {
        text = text + `Filename: ${this.responseData.document.name }`;
      }

      const filename = `data-${this.responseData.tag}.txt`;
      const link = document.createElement("a");

      link.setAttribute("target", "_blank");

      if(Blob !== undefined) {
        const blob = new Blob([text], { type: "text/plain" });
        link.setAttribute("href", URL.createObjectURL(blob));
      } else {
        link.setAttribute("href","data:text/plain," + encodeURIComponent(text));
      }

      link.setAttribute("download", filename);
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  }
});
</script>
