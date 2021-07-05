<template>
  <div>
    <custom-card
      title="Add integrity"
      subtitle="Equip your data with integrity by hashing and anchoring it on blockchain."
    >
      <create-data />
    </custom-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CustomCard from '~/components/CustomCard.vue';
import CreateData from '~/components/CreateData.vue';

export default Vue.extend({
  components: {
    CustomCard,
    CreateData
  }
});
</script>
