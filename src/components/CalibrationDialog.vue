<template>
  <v-container>
      <v-dialog
            v-model="dialog"
            persistent
            max-width="600px"
          >
            <v-card>
              <v-card-title>
                <span class="text-h5">{{message}}</span>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="dialog = false"
                >
                  Fechar
                </v-btn>
                <v-btn 
                  color="blue darken-1"
                  text 
                  @click="sensorInPosition"
                >
                  Ok
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
  </v-container>
</template>

<script>
export default {
    props: {
        message: {
            type: String,
            required: true
        },
        _dialog: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            dialog: false,
        }
    },
    watch: {
        _dialog() {
            this.dialog = this._dialog
        }
    },
    methods: {
        sensorInPosition() {
            this.dialog = false;
            console.log('sensor in position')
        }
    }
}
</script>

<style>

</style>