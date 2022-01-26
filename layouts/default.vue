<template>
  <div>
    <!-- Header -->
    <b-navbar
      fixed="top"
      toggleable="md"
      class="px-0"
      :class="[ scrollPosition >= 40 ? 'solid-nav' : 'transparent-nav']"
    >
      <b-container class="px-0375">
        <!-- Logo - mobile -->
        <b-navbar-brand to="/">
          <img src="/img/logo-bright.svg" width="166" height="45" class="d-inline-block align-top" alt="">
          <h2
            class="d-inline-block mb-0 ml-2"
            style="line-height: 44px;"
          >
            Demo
          </h2>
        </b-navbar-brand>

        <!-- Mobile hamburger -->
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <!-- Links -->
        <b-collapse
          id="nav-collapse"
          is-nav
          class="justify-content-end text-center text-md-left"
        >
          <!-- <a href="#" class="mx-md-4 d-block px-md-3 py-2">Authtrail Whitepaper</a> -->

          
          <a 
          class="mr-4"
          href="https://authtrail.com/blog/guide-how-to-use-authtrail-demo-to-add-and-check-data-integrity/">
          How to use
          </a>
          <b-button 
            variant="primary" 
            href="https://authtrail.com/"
            class="my-2 my-md-0"
          >
            Homepage
          </b-button>
          
        </b-collapse>
      </b-container>
    </b-navbar>

    <!-- Page content -->
    <div class="container main-container">
      <Nuxt />
    </div>

    <!-- Footer -->
    <footer class="pt-5 pb-5 mt-5">
      <div class="text-center">
        <!-- Footer links -->
        <!-- <div class="pb-1">
          <p class="mb-075">
            <a href="#" class="link-plain">
              Why data integrity matters for your business?
            </a>
          </p>

          <p class="mb-3">
            <a href="#" class="link-plain">
              How does it work?
            </a>
          </p>
        </div> -->
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      scrollPosition: null
    }
  },
  mounted () {
    if (process.browser) {
      window.addEventListener('scroll', this.updateScroll)
    }
  },
  beforeDestroy () {
    if (process.browser) {
      window.removeEventListener('scroll', this.updateScroll)
    }
  },
  methods: {
    updateScroll () {
      if (process.browser) {
        this.scrollPosition = document.documentElement.scrollTop
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/sass/variables';

html {
  font-family: "Poppins";
}

.main-container {
  position: relative;
  margin-top: 8rem;

  @media (min-width: 576px) {
    margin-top: 12rem;
  }

  @media (min-width: 768px) {
    margin-top: 14rem;
  }
}

.transparent-nav {
  background: transparent;
  padding-top: 2rem;
  padding-bottom: 2rem;
  transition: background-color 0.15s, padding 0.15s;

  @media (min-width: 576px) {
    padding-top: 4rem;
  }
}

.solid-nav {
  background: $bgSecondaryColor;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  box-shadow: $box-shadow;
  transition: background-color 0.15s, padding 0.15s, box-shadow 0.15s;
}

.link-plain {
  font-weight: 400;
  color: $black;
  text-decoration: underline;

  &:hover, &:focus, &:active {
    color: $primary;
    text-decoration: none;
  }
}

#nav-collapse.show {
  background-color: $white;
}
</style>
