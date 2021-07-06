<template>
  <div>
    <!-- Tag input -->
    <b-row class="mb-075">
      <b-col cols="12" md="6" class="mb-2 mb-md-0">
        <custom-textarea
          id="tag"
          v-model="tag"
          label="Enter tag (a unique data identifier)"
          placeholder="e.g. my-own-unique-tag"
          no-resize
          :disabled="!!responseData.createdAt"
        />
      </b-col>

      <!-- Description -->
      <b-col md="6">
        <div class="font-description px-md-4 mb-2">
          <p class="mb-0">
            Data tag is a unique marker that identifies a specific data entry. When checking for authenticity, a tag is used to locate the annexed data and verify its authenticity.
          </p>
          <a href="#" @click.prevent="generateTag()">Generate random tag</a>
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

      <!-- Description -->
      <b-col md="6">
        <div class="font-description px-md-4 mb-2">
          <p class="mb-0">
            Choose documents or raw data that need blockchain-backed integrity.  Once integrity is guaranteed, trusted data info can be downloaded or shared.
          </p>

          <a href="#" @click.prevent="isRawData = !isRawData">Add raw data</a>

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
            Add integrity to your data
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
import Vue from 'vue'
import JSON5 from 'json5'
import { v4 as uuidv4 } from 'uuid'
import { sha256 } from '../../lib'

import CustomTextarea from '~/components/structure/CustomTextarea.vue';

export default Vue.extend({
  components: {
    CustomTextarea
  },

  data () {
    return {
      data: '',
      document: null as any,
      isRawData: false,
      hash: '',
      tag: '',
      responseData: {
        id: '',
        tag: '',
        createdAt: '',
        hash: ''
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
        this.hash = digest.toString('hex');
      } else if (!this.isRawData && this.document) {
        this.hash = await this.hashDocument();
      }

      if (this.verifyInputs()) {
        this.error = '';
        await this.sendToAuthtrail();
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
            return resolve(digest.toString('hex'));
          }
        }
        reader.readAsArrayBuffer(this.document);
      });
    },

    async sendToAuthtrail () {
      try {
        const res = await this.$axios.$post('/data', {
          data: this.hash,
          changeType: 0,
          tag: this.tag // unique user generated id
        }, {
          headers: {
            'x-api-key': process.env.API_KEY
          }
        });
        this.responseData = {...res.data, document: this.document, verified: true};
        this.$emit('updated', this.responseData);
      } catch (e) {
        // todo error
        this.error = 'Tag already exists';
        // console.log(e);
      }
    },

    verifyInputs () {
      return this.hash && this.tag;
    },

    generateTag () {
      this.tag = uuidv4();
    }
  }
})
</script>
