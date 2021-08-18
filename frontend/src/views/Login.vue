<template>
  <v-card width="400" class="mx-auto mt-5" transition="fade-transition">
    <v-card-title>
    <h1 class="display-1">Login</h1>
    </v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-text-field 
          label="Login"
          prepend-icon="mdi-account-circle"
          v-model="username"
          :rules="nameRules" required
          />
        <v-text-field 
          :type="showPassword ? 'text' : 'password'" 
          label="Password"
          prepend-icon="mdi-lock"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
          @keydown.enter="login"
          v-model="password"
          :rules="nameRules" required/>
        <!-- <router-link to="/signup">
          Não possui uma conta? Faça Signup.  
        </router-link>  -->
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn color="info" @click="login">Login</v-btn>
      <v-spacer></v-spacer>
      <!-- <v-btn color="success" @click="register">Register</v-btn> -->
    </v-card-actions>
    <v-alert 
     type="error"
     v-model="invalidLogin"
     dismissible
     >
      Login inválido.
    </v-alert>
  </v-card>
</template>

<script>
//import APICalls from '@/services/APICalls.js'
export default {
    name: 'LoginPage',
    data() {
        return {
            showPassword: false,
            invalidLogin: false,
            username: '',
            password: '',
            nameRules: [
                v => !!v || 'Este campo é obrigatório'
            ],
        }
    },
    methods: {
      login() {
        this.$refs.form.validate()
        this.$store.dispatch('login', {
          login: this.username,
          password: this.password,
        })
        .then( () => {
          this.$router.push({name: 'dashboard'})
        })
        .catch(error => {
          console.log("erro login")
          console.log(error);
          this.invalidLogin = true;
        })
      },
      register() {
        this.$router.push({name: 'signup'})
      },
      // login() {
      //   APICalls.login({login: this.username,passowrd: this.password}).then( () => {
      //     this.$router.push({name: 'dashboard'})
      //   })
      //   .catch( error => {
      //     console.log(error);
      //   })
      // }
    }
}
</script>

<style>

</style>