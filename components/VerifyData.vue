<template>
  <div>
    <!-- Tag input -->
    <b-row class="mb-2">
      <b-col cols="12" lg="5" md="6">
        <custom-textarea
          id="tag"
          v-model="tag"
          label="Enter unique data identifier (tag)"
          no-resize
        />
      </b-col>
    </b-row>

    <!-- Data input -->
    <b-row>
      <b-col cols="12" lg="5" md="6">
        <custom-textarea
          id="data-area"
          v-model="data"
          label="Enter data"
          height="250px"
        />
      </b-col>

      <b-col cols="12" lg="2" md="1">
        <div class="or-container">or</div>
      </b-col>

      <b-col cols="12" lg="5" md="5">
        <div class="file-dropbox">
          <input
            type="file"
            class="input-file"
            @change="hashDocument"
          >
          <div class="text-center">
            <img src="/img/document-attach.png">
            <p v-if="!fileName" class="file-dropbox-text">
              <span>Choose documents</span>
              <br> or drop here
            </p>
            <p v-else class="file-dropbox-text">
              {{ fileName }}
            </p>
          </div>
        </div>
      </b-col>
    </b-row>

    <!-- Main action and response output -->
    <b-row class="mt-5">
      <b-col>
        <div v-if="!responseData.createdAt" class="text-center">
          <b-button
            variant="primary"
            @click="hashData"
          >
            <b-spinner v-if="loading" />
            <template v-else>Check integrity</template>
          </b-button>
        </div>

        <template v-else>
          <!-- Integrity guaranteed~! -->
          <div class="overview-card bg-white shadow-purple rounded">
            <div class="text-center mb-3">
              <b-icon
                v-if="responseData.verified"
                icon="check-circle-fill"
                class="text-success h2 mb-0"
              />
              <b-icon
                v-else
                icon="x-circle-fill"
                class="text-warning h2 mb-0"
              />
              <h4>
                {{ responseData.verified ? 'Integrity guaranteed' : 'Integrity compromised' }}
              </h4>
            </div>

            <!-- Tag -->
            <p>
              <span>
                <span class="label">Tag</span>
                <span>{{ responseData.tag }}</span>
              </span>

              <b-button
                class="btn-clipboard ml-1"
                variant="outline-primary"
                v-b-tooltip.ds500 :title="clipboardText"
                @click="copyToClipboard(responseData.tag)"
              >
                <b-icon icon="files" />
              </b-button>
            </p>

            <!-- TXID -->
            <p>
              <span>
                <span class="label">TX ID</span>
                <span>
                  {{ responseData.txid ? `https://moonbase-blockscout.testnet.moonbeam.network/tx/${responseData.txid}` : 'Not yet anchored' }}
                </span>
              </span>
            </p>

            <!-- Created at -->
            <p>
              <span
                class="label d-inline-block"
                v-b-tooltip.bottom.ds500 :title="responseData.createdAt"
              >
                @ {{ responseData.createdAt | formatDate }}
              </span>
            </p>
          </div>

          <!-- Go next -->
          <div class="text-center">
            <b-button
              variant="outline-primary"
              size="sm"
              @click="clearData()"
            >
              Verify more data
            </b-button>
          </div>
        </template>

        <div v-if="error" class="text-center text-warning">
          {{ error }}
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import JSON5 from 'json5';
import { v4 as uuidv4 } from 'uuid';
import { sha256 } from '../lib';

import CustomTextarea from '~/components/CustomTextarea.vue';

export default Vue.extend({
  components: {
    CustomTextarea,
  },

  data() {
    return {
      data: '',
      hash: '',
      tag: '',
      fileName: '',
      responseData: {
        txid: '',
        tag: '',
        createdAt: '',
        verified: false
      },
      deepResponseData: null,
      error: '',
      clipboardText: 'Copy to clipboard',
      loading: false,
    }
  },

  methods: {
    clearData () {
      this.data = '';
      this.hash = '';
      this.fileName = '';
      this.error = '';
      this.tag = '';
      this.responseData = {
        txid: '',
        tag: '',
        createdAt: '',
        verified: false
      };
      this.deepResponseData = null;
    },

    copyToClipboard (text: string) {
      if (process.browser) {
        this.clipboardText = 'Copied!';
        setTimeout(() => { this.clipboardText = 'Copy to clipboard'; }, 5000);
        navigator.clipboard.writeText(text);
      }
    },

    async hashData () {
      this.loading = true;

      if (!this.hash && this.data) {
        let digest: Buffer;
        try {
          digest = sha256(JSON5.stringify(JSON5.parse(this.data)));
        } catch {
          digest = sha256(this.data);
        }
        this.hash = sha256(digest.toString('hex')).toString('hex');
      }

      if (this.verifyInputs()) {
        this.error = '';
        await this.verify();
        if ((this.responseData as any)?.txid) {
          await this.verifyDeep();
        }
      } else {
        // todo error
        this.error = 'Incorrect inputs.';
      }

      this.loading = false;
    },

    hashDocument (event: any) {
      const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
      if (!file) {
        return
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const buffer = Buffer.from(reader.result)
          const digest = sha256(buffer)
          this.hash = sha256(digest.toString('hex')).toString('hex')
        }
      };
      reader.readAsArrayBuffer(file);
      this.fileName = file.name;
    },

    async verify () {
      try {
        const res = await this.$axios.$post('/verify', {
          hash: this.hash,
          tag: this.tag // unique user generated id
        }, {
          headers: {
            'x-api-key': process.env.API_KEY
          }
        });
        this.responseData = res.data;
      } catch (e) {
        // todo error;
        console.log(e)
      }
    },

    async verifyDeep () {
      try {
        const res = await this.$axios.$post('/verify/deep', {
          hash: this.hash,
          tag: this.tag // unique user generated id
        }, {
          headers: {
            'x-api-key': process.env.API_KEY
          }
        });
        this.deepResponseData = res.data;
        this.$emit('verified', this.deepResponseData);
      } catch (e) {
        // todo error
        console.log(e);
      }
    },

    verifyInputs () {
      return this.hash && this.tag;
    },
  }
})
</script>

<style lang="scss" scoped>
  @import "../assets/sass/abstracts/variables";

  .or-container {
    display: flex;
    height: 100px;
    align-items: center;
    justify-content: center;

    @media (min-width: 768px) {
      height: 250px;
    }
  }

  .file-dropbox {
    border: $border-width dashed $primary;
    border-radius: $border-radius;
    position: relative;
    cursor: pointer;
    height: 250px;
    padding: 40px;

    .file-dropbox-text {
      margin-top: 21px;

      span {
        color: $primary;
        font-weight: 700;
      }
    }

    &:hover {
      .file-dropbox-text {
        span {
          opacity: 0.8;
        }
      }
    }
  }

  .input-file {
    top: 0;
    left: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    z-index: 10;
    position: absolute;
  }

  .overview-card {
    padding: 1rem;
    margin: 0 auto 3rem;
    max-width: 530px;

    .label {
      color: $gray-500;
      display: block;
      font-size: 0.875rem;
      line-height: 1;
    }

    p {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
      word-break: break-word;
      word-wrap: break-word;
    }
  }
</style>
