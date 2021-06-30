<template>
  <div>
    <b-row>
      <!-- Hash -->
      <b-col md="6" class="mb-075">
        <div>
          <custom-textarea
            id="hash"
            v-model="hash"
            label="Enter hash"
            no-resize
            height="110px"
            :disabled="!!verified"
            @input="validationErrors.hash = ''"
          />

          <p v-if="validationErrors.hash" class="validation-error">
            {{ validationErrors.hash }}
          </p>
        </div>
      </b-col>

      <!-- Anchor data -->
      <b-col md="6" class="mb-075">
        <div>
          <custom-textarea
            id="anchor"
            v-model="anchorData"
            :label="useMetamask ? 'Enter transaction ID' : 'Enter anchor data'"
            no-resize
            height="110px"
            :disabled="!!verified"
            @input="validationErrors.anchorData = ''"
          />

          <p v-if="validationErrors.anchorData" class="validation-error">
            {{ validationErrors.anchorData }}
          </p>
        </div>

        <!-- <b-form-checkbox
          v-if="connected"
          v-model="useMetamask"
          class="metamask-switch mb-1 d-block d-sm-none"
          switch
          @change="useMetamask = !useMetamask; anchorData = '';"
        >
          Use Metamask
        </b-form-checkbox> -->
      </b-col>

      <!-- Blocks -->
      <b-col md="6" class="mb-075">
        <div>
          <custom-textarea
            id="blocks"
            v-model="blocks"
            label="Enter blocks"
            height="250px"
            :disabled="!!verified"
            @input="validationErrors.blocks = ''"
          />

          <p v-if="validationErrors.blocks" class="validation-error">
            {{ validationErrors.blocks }}
          </p>
        </div>
      </b-col>

      <!-- Merkle proof -->
      <b-col md="6" class="mb-075">
        <div>
          <custom-textarea
            id="merkleProof"
            v-model="merkleProof"
            label="Enter merkle proof"
            height="250px"
            :disabled="!!verified"
            @input="validationErrors.merkleProof = ''"
          />

          <p v-if="validationErrors.merkleProof" class="validation-error">
            {{ validationErrors.merkleProof }}
          </p>
        </div>
      </b-col>
    </b-row>

    <!-- Errors -->
    <b-row v-if="verifyError" class="mt-5">
      <b-col md="6" class="mx-auto" style="max-width: 530px;">
        <div v-if="verifyError === verifyErrors.GENERAL" class="text-center">
          There was a problem while verifying data. Please make sure that you entered correct values in their corresponding fields and try again.
        </div>

        <div v-else-if="verifyError === verifyErrors.NETWORK" class="text-center">
          There was a problem while verifying data. Please make sure that MetaMask is connected to Main Ethereum network.
        </div>
      </b-col>
    </b-row>

    <!-- Main action and response output -->
    <b-row class="mt-5">
      <b-col>
        <div v-if="!verified" class="text-center">
          <b-button
            v-if="!verified"
            variant="primary"
            :disabled="loading"
            @click="validate"
          >
            Verify
            <b-spinner v-if="loading" small class="btn-spinner" />
          </b-button>
        </div>

        <template v-else>
          <!-- Integrity guaranteed~! -->
          <div class="overview-card bg-white shadow-purple rounded">
            <div class="text-center my-3">
              <b-icon
                icon="check-circle-fill"
                class="text-success h2 mb-1"
              />
              <h4>
                Integrity guaranteed
              </h4>
            </div>
          </div>

          <div class="text-center">
            <b-button
              variant="outline-primary"
              size="sm"
              @click="clearData()"
            >
              Clear data
            </b-button>
          </div>
        </template>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import JSON5 from 'json5';
import { blockHash, merkleRoot, validateJSON } from '../lib';
import { Web3Helper } from '../lib/web3';

import CustomTextarea from '~/components/CustomTextarea.vue';

export default Vue.extend({
  components: {
    CustomTextarea,
  },

  props: {
    validateData: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      web3: new Web3Helper(),
      connected: false,
      useMetamask: false,
      anchorData: '',
      hash: '',
      merkleProof: '',
      blocks: '',
      verified: false,
      verifyError: 0,
      loading: false,
      validationErrors: {
        hash: '',
        anchorData: '',
        blocks: '',
        merkleProof: ''
      },
      verifyErrors: {
        GENERAL: 1,
        NETWORK: 2
      }
    }
  },
  watch: {
    hashedData (value) {
      this.hash = value
      this.merkleProof = ''
      this.blocks = ''
      this.anchorData = ''
      this.verified = false
    }
  },
  mounted () {
    this.connected = this.web3.connect()
    this.blocks = JSON.stringify(this.validateData.blocks)
    this.merkleProof = JSON.stringify(this.validateData.merkleProof)
    this.anchorData = this.validateData.anchorData
    this.hash = this.validateData.hash
  },
  methods: {
    clearData () {
      this.hash = ''
      this.merkleProof = ''
      this.blocks = ''
      this.anchorData = ''
      this.verified = false
    },
    validate () {
      let errors = false
      if (!this.hash) {
        this.validationErrors.hash = 'Please enter data hash.'
        errors = true
      }

      if (!this.anchorData) {
        this.validationErrors.anchorData = `Please enter ${this.useMetamask ? 'transaction ID' : 'anchor data'}.`
        errors = true
      }

      if (!this.blocks) {
        this.validationErrors.blocks = 'Please enter blocks.'
        errors = true
      } else if (!validateJSON(this.blocks)) {
        this.validationErrors.blocks = 'Blocks must be in valid JSON format.'
        errors = true
      }

      if (!this.merkleProof) {
        this.validationErrors.merkleProof = 'Please enter merkle proof.'
        errors = true
      } else if (!validateJSON(this.merkleProof)) {
        this.validationErrors.merkleProof = 'Merkle proof must be in valid JSON format.'
        errors = true
      }

      if (!errors) {
        this.verify()
      }
    },
    verify () {
      this.loading = true;
      this.verifyError = 0;

      const proof = JSON5.parse(this.merkleProof);
      const root = merkleRoot(proof, this.hash);
      const blocks = JSON5.parse(this.blocks);
      const verified = blockHash(blocks, root);

      if (root === '' || verified === '') {
        this.verifyError = this.verifyErrors.GENERAL;
        this.loading = false;
        return;
      }

      if (this.connected && this.useMetamask) {
        console.log(this.anchorData);

        this.web3.readTxData(this.anchorData).then((txData) => {
          if (txData !== null) {
            this.verified = Buffer.from(txData[2], 'base64').toString('hex') === verified;
          } else {
            this.verifyError = this.verifyErrors.NETWORK;
            this.verified = false;
          }
        }).catch((error) => {
          console.log(error)
          this.verifyError = this.verifyErrors.GENERAL;
          this.verified = false;
        })
      } else {
        this.verified = verified === this.anchorData;
      }

      this.loading = false;
    }
  }
})
</script>

<style lang="scss" scoped>
  @import "../assets/sass/variables";

  .validation-error {
    color: $warning;
    font-size: 0.875rem;
    margin-bottom: 0;
  }
</style>
