<template>
  <div>
    <div class="row data-hash-row">
      <div class="col-12 col-md-5 tag-input-box">
        <div class="data-input-inner-box">
          <p class="data-input-label">
            Enter unique data identifier (tag)
          </p>
          <b-icon icon="arrow-repeat" class="generate-tag" @click="generateTag()"></b-icon>
          <textarea ref="data-hash-input" v-model="tag" class="data-input-textarea" />
        </div>
      </div>
    </div>
    <div class="row data-hash-row mt-1">
      <div class="col-12 col-md-5 data-input-box">
        <div class="data-input-inner-box">
          <p class="data-input-label">
            Enter data
          </p>
          <textarea ref="data-hash-input" v-model="data" class="data-input-textarea" />
        </div>
      </div>
      <div class="or-container col-12 col-md-2">
        <span>or</span>
      </div>
      <div class="col-12 col-md-5 px-0">
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
      </div>
    </div>
    <div class="row d-flex justify-content-center mt-5">
      <b-button
        v-if="!responseData"
        variant="primary"
        @click="hashData"
      >
        Add integrity
      </b-button>
      <div v-else class="col-12 data-hash">
        <p class="data-hash-status">
          <img src="/img/check-hashed.png">
          Integrity guaranteed
        </p>
        <div class="data-hash-hash">
          <p>{{ responseData.id }}</p>
          <p>{{ responseData.tag }}</p>
          <p>{{ responseData.createdAt }}</p>
          <p>{{ responseData.hash }}</p>
          <img class="copy-icon" src="/img/copy.svg" @click="copyToClipboard(responseData.tag)">
        </div>
        <p class="data-hash-clear" @click="clearData()">
          Add integrity to more data
        </p>
      </div>
      <div v-if="error" class="col-12 data-error">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import JSON5 from 'json5'
import { v4 as uuidv4 } from 'uuid'
import { sha256 } from '../lib'

export default Vue.extend({
  data () {
    return {
      data: '',
      hash: '',
      tag: '',
      fileName: '',
      responseData: null,
      error: ''
    }
  },
  methods: {
    clearData () {
      this.data = ''
      this.hash = ''
      this.fileName = ''
      this.error = ''
      this.tag = ''
      this.responseData = null
    },
    copyToClipboard (text: string) {
      if (process.browser) {
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
    color: #aaaaaa;

    @media (max-width: 768px) {
      height: 100px;
    }
  }

  .data-error {
    text-align: center;
    color: $errorColor;
    margin-top: 35px;
  }

  .data-hash {
    text-align: center;

    .data-hash-status {
      color: $primaryColor;
      font-size: 23px;
      margin-bottom: 35px;
      font-weight: 600;

      img {
        margin-right: 11px;
        padding-bottom: 2px;
      }
    }

    .data-hash-hash {
      font-size: 19px;
      word-break: break-word;
    }

    .data-hash-clear {
      cursor: pointer;
      color: #aaaaaa;

      &:hover {
        opacity: 0.7;
      }
    }
  }

  .file-dropbox {
    border: 2px dashed $primaryColor;
    position: relative;
    cursor: pointer;
    height: 250px;
    padding: 40px;

    .file-dropbox-text {
      margin-top: 21px;
      font-size: 16px;

      span {
        color: $primaryColor;
        font-weight: 600;
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
</style>
