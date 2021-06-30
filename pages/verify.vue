<template>
  <div class="container">
    <div class="main-container">
      <div class="row mb-5 pt-5 d-flex">
        <h1 class="col-12 col-sm-6 title">
          Demo - verify data
        </h1>
        <div class="col-12 col-sm-6 instructions-link">
          <nuxt-link to="/">
            Integrity
          </nuxt-link>
        </div>
      </div>
      <div class="step-container">
        <h3 class="step-title">
          Enter data
        </h3>
        <VerifyData
          class="step-content"
          @verified="handleValidateData($event)"
        />
      </div>
      <div id="#second-step" class="step-container">
        <div v-if="validateData" >
          <h3 class="step-title">
            Hash data - manual verify
          </h3>
          <ValidateData
            class="step-content"
            :validate-data="validateData"
          />
        </div>
      </div>
    </div>
    <div class="step-container">
      <h3 class="step-title">
        <strong>1. Step</strong> Enter data
      </h3>
      <VerifyData
        class="step-content"
      />
    </div>
    <div id="#second-step" class="step-container">
      <h3 class="step-title">
        <strong>2. Step</strong> Verify data
      </h3>
      <ValidatateData
        class="step-content"
        :hashed-data="hashedData"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      validateData: ''
    }
  },
  methods: {
    handleValidateData (data: any) {
      this.validateData = data
      if (process.browser) {
        const VueScrollTo = require('vue-scrollto')
        const element = document.getElementById('#second-step')
        VueScrollTo.scrollTo(element, 1000)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
  @import "../assets/sass/abstracts/variables";

  .title {
    font-size: 70px;
    font-weight: 600;

    @media (max-width: 576px) {
      font-size: 60px;
    }
  }

  .step-container {
    margin-bottom: 80px;

    .step-title {
      font-weight: 400;
      margin-bottom: 28px;

      strong {
        font-weight: 600;
      }
    }

    .step-content {
      background-color: white;
      box-shadow: 0px 8px 63px #1C325B0F;
      padding: 45px 44px 62px 44px;
    }
  }
</style>
