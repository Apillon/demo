<template>
  <div class="container">
    <div class="main-container">
      <div class="row mb-5 pt-5 d-flex">
        <h1 class="col-12 col-sm-6 mb-0">
          Demo
        </h1>
        <div class="col-12 col-sm-6 d-flex justify-content-end align-items-center">
          <b-button
            size="sm"
            variant="outline-primary"
            to="/verify"
          >
            Verify
          </b-button>
        </div>
      </div>
      <div class="bg-white shadow-purple rounded-lg p-4">
        <h3 class="mb-4">
          1. Step <span class="font-weight-normal">Enter data</span>
        </h3>
        <CreateData />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      hashedData: ''
    }
  },
  methods: {
  }
})
</script>

<style lang="scss" scoped>
  @import "../assets/sass/abstracts/variables";

  // .instructions-link {
  //   display: flex;
  //   align-items: flex-end;
  //   width: 100%;
  //   justify-content: flex-end;
  //   padding-bottom: 19px;

  //   a {
  //     color: $primaryColor;
  //     font-weight: 600;
  //     text-decoration: none;

  //     &:hover {
  //       opacity: 0.7;
  //     }
  //   }
  // }

  .main-container {
    margin-top: 130px;
  }

  // .title {
  //   font-size: 70px;
  //   font-weight: 600;

  //   @media (max-width: 576px) {
  //     font-size: 60px;
  //   }
  // }

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
