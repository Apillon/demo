<template>
  <div>
    <!-- Tag input -->
    <b-row class="mb-2">
      <b-col cols="12" md="5">
        <custom-textarea
          id="tag"
          v-model="tag"
          label="Enter unique data identifier (tag)"
          no-resize
        >
          <template #after-label>
            <b-icon
              icon="arrow-repeat"
              class="pointer text-primary"
              @click="generateTag()"
            />
          </template>
        </custom-textarea>
      </b-col>
    </b-row>

    <!-- Data input -->
    <b-row>
      <b-col cols="12" md="5">
        <custom-textarea
          id="data-area"
          v-model="data"
          label="Enter data"
          height="250px"
        />
      </b-col>

      <b-col cols="12" md="2">
        <div class="or-container">or</div>
      </b-col>

      <b-col cols="12" md="5">
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

    <b-row class="mt-5">
      <b-col>
        <div v-if="!responseData.id" class="text-center">
          <b-button
            variant="primary"
            @click="hashData"
          >
            Add integrity
          </b-button>
        </div>

        <template v-else>
          <b-col md="6" class="mx-auto mb-5">
            <!-- Integrity guaranteed~! -->
            <div class="overview-card bg-white shadow-purple rounded" style="max-width: 500px;">
              <div class="text-center mb-3">
                <b-icon icon="check-circle-fill" class="text-success h2 mb-0" />
                <h4>Integrity guaranteed</h4>
              </div>

              <!-- ID -->
              <p>
                <span>
                  <span class="label">ID</span>
                  <span>{{ responseData.id }}</span>
                </span>
              </p>

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

              <!-- Hash -->
              <p>
                <span>
                  <span class="label">Hash</span>
                  <span>{{ responseData.hash }}</span>
                </span>
              </p>

              <p>
                <span
                  class="label d-inline-block"
                  v-b-tooltip.bottom.ds500 :title="responseData.createdAt"
                >
                  @ {{ responseData.createdAt | formatDate }}
                </span>
              </p>
            </div>
          </b-col>

          <div class="text-center">
            <b-button
              variant="outline-primary"
              size="sm"
              @click="clearData()"
            >
              Add integrity to more data
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
import Vue from 'vue'
import JSON5 from 'json5'
import { v4 as uuidv4 } from 'uuid'
import { sha256 } from '../lib'

import CustomTextarea from '~/components/CustomTextarea.vue';

export default Vue.extend({
  components: {
    CustomTextarea
  },

  data () {
    return {
      data: '',
      hash: '',
      tag: '',
      fileName: '',
      responseData: {
        id: '',
        tag: '',
        createdAt: '',
        hash: ''
      },
      error: '',
      clipboardText: 'Copy to clipboard',
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
        id: '',
        tag: '',
        createdAt: '',
        hash: ''
      };
    },

    copyToClipboard (text: string) {
      if (process.browser) {
        this.clipboardText = 'Copied!';
        setTimeout(() => { this.clipboardText = 'Copy to clipboard'; }, 5000);
        navigator.clipboard.writeText(text)
      }
    },

    async hashData () {
      if (!this.hash && this.data) {
        let digest: Buffer
        try {
          digest = sha256(JSON5.stringify(JSON5.parse(this.data)))
        } catch {
          digest = sha256(this.data)
        }
        this.hash = digest.toString('hex')
      }
      if (this.verifyInputs()) {
        this.error = ''
        await this.sendToAuthtrail()
      } else {
        // todo error
        this.error = 'Incorrect inputs.'
      }
    },

    hashDocument (event: any) {
      const file = event.target.files && event.target.files[0] ? event.target.files[0] : null
      if (!file) {
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.result) {
          const buffer = Buffer.from(reader.result)
          const digest = sha256(buffer)
          this.hash = digest.toString('hex')
        }
      }
      reader.readAsArrayBuffer(file)
      this.fileName = file.name
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
        })
        this.responseData = res.data
      } catch (e) {
        // todo error
        console.log(e)
      }
    },

    verifyInputs () {
      return this.hash && this.tag
    },

    generateTag () {
      this.tag = uuidv4()
    }
  }
})
</script>

<style lang="scss" scoped>
  @import "../assets/sass/abstracts/variables";

  .generate-tag {
    position: absolute;
    top: 18px;
    right: 20px;
    color: $primaryColor;
  }

  .generate-tag:hover {
    cursor: pointer;
  }

  .data-input-box {
    height: 250px;
  }

  .tag-input-box {
    height: 100px;
  }

  .or-container {
    display: flex;
    height: 250px;
    align-items: center;
    justify-content: center;

    @media (max-width: 768px) {
      height: 100px;
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

  .copy-icon {
    height: 100%;
    width: 24px;
    padding-bottom: 3px;
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    }
  }

  .overview-card {
    padding: 1rem;

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
    }
  }
</style>
