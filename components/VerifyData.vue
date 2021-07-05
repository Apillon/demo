<template>
  <div>
    <!-- Tag input -->
    <b-row class="mb-075">
      <b-col cols="12" md="6" class="mb-2 mb-md-0">
        <custom-textarea
          id="tag"
          v-model="tag"
          label="Enter tag (a unique data identifier)"
          no-resize
          :disabled="!!responseData.createdAt"
        />
      </b-col>

      <b-col md="6">
        <div class="font-description px-md-4 mb-2">
          <p class="mb-0">
            Data tag is a unique marker that identifies a specific data entry. Enter the tag that marks the data entry you want to verify.
          </p>
        </div>
      </b-col>
    </b-row>

    <!-- Data input -->
    <b-row>
      <b-col cols="12" md="6" class="mb-2 mb-md-0">
        <!-- Raw data -->
        <custom-textarea
          v-if="isRawData"
          id="data-area"
          v-model="data"
          label="Enter data"
          height="250px"
          :disabled="!!responseData.createdAt"
        />

        <!-- Document data -->
        <div
          v-else
          class="file-dropbox"
          :class="{'not-allowed': !!responseData.createdAt}"
        >
          <input
            type="file"
            :disabled="!!responseData.createdAt"
            class="input-file"
            :class="{'not-allowed': !!responseData.createdAt}"
            @change="setDocument"
          >
          <div class="text-center">
            <img src="/img/document-attach.png">
            <p v-if="!document || !document.name" class="file-dropbox-text">
              <span>Add document</span>
              <br> or drop here
            </p>
            <p v-else class="file-dropbox-text">
              {{ document.name }}
            </p>
          </div>
        </div>
      </b-col>

      <b-col md="6">
        <div class="font-description px-md-4 mb-2">
          <p class="mb-0">
            Choose documents or raw data that you want to verify for blockchain-backed integrity.
          </p>

          <a href="#" @click="isRawData = !isRawData">Enter raw data</a>

          <p class="mb-0 mt-4 text-gray">
            Authtrail allows non-demo users to update and add versions to existing data by connecting entries through advanced data mapping and processing logic.
          </p>

          <a href="#" class="text-gray font-weight-bold text-underline">Send inquiry for customized Authtrail solution.</a>
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
            Check data integrity
            <b-spinner v-if="loading" small class="btn-spinner" />
          </b-button>
        </div>

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
      document: null as any,
      isRawData: false,
      hash: '',
      tag: '',
      responseData: {
        txid: '',
        tag: '',
        createdAt: '',
        verified: false,
        deepResponseData: null,
      },
      error: '',
      loading: false,
    }
  },

  methods: {
    async hashData () {
      this.loading = true;

      this.hash = '';

      if (this.isRawData && this.data) {
        let digest: Buffer;
        try {
          digest = sha256(JSON5.stringify(JSON5.parse(this.data)));
        } catch {
          digest = sha256(this.data);
        }
        this.hash = sha256(digest.toString('hex')).toString('hex');
      } else if (!this.isRawData && this.document) {
        this.hash = await this.hashDocument();
      }

      if (this.verifyInputs()) {
        this.error = '';
        this.responseData = await this.verify();
        if (this.responseData.txid) {
          this.responseData.deepResponseData = await this.verifyDeep();
        }
        this.$emit('updated', this.responseData);
      } else {
        // todo error
        this.error = 'Incorrect input data';
      }

      this.loading = false;
    },

    setDocument(event: any) {
      this.document = event.target.files && event.target.files[0] ? event.target.files[0] : null;
    },

    hashDocument(): Promise<string> {
      return new Promise(resolve => {
        if (!this.document || !(this.document instanceof Blob)) {
          return resolve('');
        }

        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            const buffer = Buffer.from(reader.result);
            const digest = sha256(buffer);
            return resolve(sha256(digest.toString('hex')).toString('hex'));
          }
        };
        reader.readAsArrayBuffer(this.document);
      });
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
        return res.data;
      } catch (e) {
        // todo error;
        console.log(e)
      }

      return {
        txid: '',
        tag: '',
        createdAt: '',
        verified: false,
        deepResponseData: null
      };
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
        return res.data;
      } catch (e) {
        // todo error
        console.log(e);
      }

      return null;
    },

    verifyInputs () {
      return this.hash && this.tag;
    },
  }
})
</script>
