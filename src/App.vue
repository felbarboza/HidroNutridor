<template>
  <v-app>
    <v-app-bar app color="green" dark>
      <v-toolbar-title>Hidronutridor</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn 
        v-for="link in activeLinks"
        :key="`${link.label}-header-link`"
        text 
        rounded 
        :to="link.url">
        {{link.label}}
      </v-btn> -->
      <v-btn
        v-if="!loggedIn"
        text 
        rounded 
        to='/login'>
        {{'Login'}}
      </v-btn>
      <v-btn
      v-if="loggedIn"
        text 
        rounded 
        to='/dashboard'>
        {{'Dashboard'}}
      </v-btn>
      <v-btn
      v-if="loggedIn"
        text 
        rounded 
        to='/calibration'>
        {{'Calibragem'}}
      </v-btn>
      <v-btn
        v-if="loggedIn"
        text 
        rounded 
        @click="logout">
        {{'Logout'}}
      </v-btn>
    </v-app-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-footer
      color="green lighten-1"
      padless
    >
      <v-row
        justify="center"
        no-gutters
      >
        <!-- <v-btn
          v-for="link in links"
          :key="`${link.label}-footer-link`"
          color="white"
          text
          rounded
          class="my-2"
          :to="link.url"
        >
          {{ link.label }}
        </v-btn> -->
        <v-col
          class="green lighten-2 py-4 text-center white--text"
          cols="12"
        >
          {{ new Date().getFullYear() }} — <strong>Hidronutridor</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
//import HelloWorld from './views/Login.vue';
import { authComputed } from '@/store/helpers.js'
export default {
  name: 'App',

  components: {
    //HelloWorld,
  },

  data: () => ({
    links: [
      {
        label: 'Home',
        url: '/',
        loginRequired: false,
      },
      {
        label:'Login',
        url:'/login',
        loginRequired: false,
      },
      {
        label:'Dashboard',
        url:'/dashboard',
        loginRequired: true,
      },
    ]
  }),
  computed: {
    ...authComputed
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
    },
  }
};
</script>
