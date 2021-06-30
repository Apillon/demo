<template>
  <div>
    <!-- Tag input -->
    <b-row class="mb-075">
      <b-col cols="12" lg="5" md="6">
        <custom-textarea
          id="tag"
          v-model="tag"
          label="Enter unique data identifier (tag)"
          no-resize
          :disabled="!!responseData.createdAt"
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
          :disabled="!!responseData.createdAt"
        />
      </b-col>

      <b-col cols="12" lg="2" md="1">
        <div class="or-container">or</div>
      </b-col>

      <b-col cols="12" lg="5" md="5">
        <div class="file-dropbox" :class="{'not-allowed': !!responseData.createdAt}">
          <input
            type="file"
            :disabled="!!responseData.createdAt"
            class="input-file"
            :class="{'not-allowed': !!responseData.createdAt}"
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
            :disabled="loading"
            @click="hashData"
          >
            Check Integrity
            <b-spinner v-if="loading" small class="btn-spinner" />
          </b-button>
        </div>

        <template v-else>
          <!-- Integrity guaranteed~! -->
          <div class="overview-card bg-white shadow-purple rounded">
            <div class="text-center my-3">
              <b-icon
                v-if="responseData.verified"
                icon="check-circle-fill"
                class="text-success h2 mb-1"
              />
              <b-icon
                v-else
                icon="x-circle-fill"
                class="text-warning h2 mb-1"
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

                <a
                  v-if="responseData.txid"
                  :href="`https://moonbase-blockscout.testnet.moonbeam.network/tx/${responseData.txid}`"
                  target="_blank"
                  v-b-tooltip.ds500 title="Open transaction"
                >
                  {{ responseData.txid }}
                </a>

                <span v-else>
                  Not yet anchored
                  <b-spinner variant="dark" small style="margin-bottom: 2px;" />
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

          <div class="text-center">
            <!-- Open manual verify -->
            <b-button
              v-if="responseData.txid && !isDetailsOpen"
              variant="primary"
              size="sm"
              class="d-block d-md-inline-block mb-2 mb-md-0 mx-auto"
              @click="
                $emit('verified', deepResponseData);
                isDetailsOpen = true;
              "
            >
              View verification details
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

        <div v-if="error" class="text-center text-warning mt-075">
          {{ error }}
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import JSON5 from 'json5';
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
      isDetailsOpen: false,
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
      this.$emit('verified', null);
      this.isDetailsOpen = false;
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
        if (this.responseData.txid) {
          await this.verifyDeep();
        }
      } else {
        // todo error
        this.error = 'Incorrect input data';
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
        // this.$emit('verified', this.deepResponseData);
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
