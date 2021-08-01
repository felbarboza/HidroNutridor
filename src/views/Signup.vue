<template>
  <v-container>
      <v-row>
          <v-col>
              <v-form refs="signupForm" v-model="formValidity" @submit="register">
                  <v-text-field label="Nome" type="text" v-model="name" :rules="nameRules" required>
                  </v-text-field>
                  <v-text-field label="Login" type="text" v-model="login" :rules="nameRules" required>
                  </v-text-field>
                  <v-text-field label="Password" type="text" v-model="password" :rules="nameRules" required>
                  </v-text-field>
                  <!-- <v-text-field label="E-mail" type='email' v-model="email" :rules="emailRules" required></v-text-field> -->
                  <!-- <router-link to="/login">
                    Já possui uma conta? Faça Login.  
                  </router-link>  -->
              </v-form>
              <v-btn type="submit" color="primary" :disabled="!formValidity" @click="register">Salvar</v-btn>
          </v-col> 
      </v-row>
  </v-container>
</template>

<script>
export default {
    data() {
        return {
            formValidity: false,
            name: '',
            login: '',
            //email: '',
            password: '',
            // emailRules: [
            //     v => !!v || 'E-mail é obrigatório',
            //     v => /.+@.+/.test(v) || 'E-mail inválido'
            // ],
            nameRules: [
                v => !!v || 'Este campo é obrigatório'
            ]
        }
    },
    methods: {
        validateForm() {
            this.$refs.signupForm.validate()
        },
        register() {
            this.$store.dispatch('register',{
                name: this.name,
                login: this.login,
                password: this.password,
            })
            .then(() => {
                this.$router.push({name: 'login'})
            })
        }
        // register() {
        //     APICalls.setUserData({
        //         name: this.name,
        //         login: this.login,
        //         password: this.password,
        //     }).then(() => {
        //         this.$router.push({name: 'dashboard'})
        //     })
        // }
    }
}
</script>

<style>

</style>