<template>
  <div class="custom-textarea">
    <div class="custom-textarea__top">
      <label :for="id" :class="!disabled ? 'bg-white' : 'bg-transparent'">
        {{ label }}
      </label>

      <slot name="after-label" class="after-label" />
    </div>

    <b-form-textarea
      :id="id"
      :value="value"
      :no-resize="noResize"
      :disabled="disabled"
      class="custom-textarea__input"
      :style="{ height }"
      @input="$emit('input', $event)"
    ></b-form-textarea>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    id: { type: String, default: '', required: true },
    value: { type: String, default: '' },
    height: { type: String, default: '100px' },
    label: { type: String, default: 'Enter data' },
    noResize: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  }
});
</script>

<style lang="scss" scoped>
@import '../assets/sass/variables';
@import '../assets/sass/typography';

.custom-textarea {
  height: 100%;
  background: transparent;
  position: relative;

  &__top {
    position: absolute;
    padding: 0.5rem 1.125rem 0;

    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    label {
      @extend .font-label;
      margin-bottom: 0;
    }
  }

  &__input {
    padding-top: 1.75rem;
  }

  ::-webkit-scrollbar {
    width: 4px;
  }

  ::-webkit-scrollbar-track {
    border-radius: 0px;
  }

  ::-webkit-scrollbar-thumb {
    background: $primary;
    border-radius: 0px;
  }
}
</style>
