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
        <!-- Logo -->
        <b-navbar-brand to="/" class="d-md-none">
          <img src="/img/logotype.svg" width="166" height="45" class="d-inline-block align-top" alt="">
        </b-navbar-brand>

        <!-- Mobile hamburger -->
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <!-- Links -->
        <b-collapse id="nav-collapse" is-nav class="justify-content-md-between">
          <!-- Logo - positioning on desktop -->
          <b-navbar-brand to="/" class="d-none d-md-inline-block">
            <img src="/img/logotype.svg" width="166" height="45" class="d-inline-block align-top" alt="">
          </b-navbar-brand>

          <!-- Centered nav items -->
          <b-navbar-nav>
            <b-nav-item to="/" class="mx-md-2">
              Enter data
            </b-nav-item>

            <b-nav-item to="/verify" class="mx-md-2">
              Verify data
            </b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-button 
            variant="primary" 
            href="https://authtrail.com/"
            class="mt-2 mt-md-0"
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
        <div class="at-verified">
          <img src="/img/verified.svg" alt="Verified by AuthTrail" style="max-width: 127px;">
        </div>
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
@import '../assets/sass/variables';
  .main-container {
    margin-top: 119px;
  }

  .transparent-nav {
    background: $white;
    padding-top: 2rem;
    padding-bottom: 2rem;
    transition: background-color 0.15s, padding 0.15s;
  }

  .solid-nav {
    background: $white;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    box-shadow: 0px 2px 16px $primary-transparent;
    transition: background-color 0.15s, padding 0.15s, box-shadow 0.15s;
  }
</style>

<style lang="scss">
@import '../assets/sass/variables';

nav.navbar {
  .navbar-nav .nav-link {
    color: $dark;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.5rem;

    &.nuxt-link-exact-active {
      color: $primary;
    }
  }

  .navbar-toggler {
    border: none;
  }
}
</style>