<template>
    <v-container>
        <v-card>
            <v-card-title>{{title}}</v-card-title>
            <v-form
                v-model="formValidity"
                :disabled="!isEditing"
            >   
                <template>
                    <v-row>
                        <v-col cols="6">
                            <v-text-field
                                class="shrink pl-10"
                                v-model="offset"
                                :label="label"
                                :rules="numberRules" 
                                required
                            >
                            </v-text-field> 
                        </v-col>
                    </v-row>
                </template>
            </v-form>
            <v-card-actions>
                <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="editValue()"
                    >
                    Editar
                    </v-btn>
                    <v-btn 
                        color="blue darken-1"
                        :disabled="!formValidity"
                        text 
                        @click="saveValue()"
                    >
                    Salvar
                    </v-btn>
            </v-card-actions>
        </v-card>
        <CalibrationDialog :message="message" :_dialog="dialog"/>
    </v-container>
</template>

<script>
import CalibrationDialog from '../components/CalibrationDialog.vue'
import APICalls from '../services/APICalls.js'
export default {
    components: {CalibrationDialog},
    props: {
        calibrationType: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            offset: 0,
            formValidity: false,
            dialog: false,
            isEditing: false,
            numberRules: [
                v => !!v || v<0 || 'Valor inválido.'
            ]
        }
    },
    methods: {
        editValue() {
            this.dialog = !this.dialog;
            this.isEditing = !this.isEditing;
            if(this.calibrationType === 'acidPH'){
                console.log(`Editing ${this.calibrationType} offset value: ${this.offset}`)
            }
            if(this.calibrationType === 'basicPH'){
                console.log(`Editing ${this.calibrationType} offset value: ${this.offset}`)
            }   
            if(this.calibrationType === 'conductivity'){
                console.log(`Editing ${this.calibrationType} offset value: ${this.offset}`)
            }        
        },
        async saveValue() {
            this.isEditing = false;
            //this.formValidity = false;
            if(this.calibrationType === 'acidPH'){
                this.$store.state.acidicPH = this.offset;
                console.log(`Saving ${this.calibrationType} offset value: ${this.offset}`)       
                this.$emit('loading',true);
                await APICalls.setLowPHCalibration(this.$store.state.currentGreenhouse, this.offset, this.$store.state.user.token)
                .then( response => {
                    console.log(response)
                    this.$store.state.acidicPH = this.offset;
                    this.$emit('proceed',true);
                })
                .catch(error => {
                    console.log(error)
                })
            }
            if(this.calibrationType === 'basicPH'){
                this.$store.state.basicPH = this.offset;
                console.log(`Saving ${this.calibrationType} offset value: ${this.offset}`)
                this.$emit('loading',true);
                await APICalls.setHighPHCalibration(this.$store.state.currentGreenhouse, this.offset, this.$store.state.user.token)
                .then( response => {
                    console.log(response)
                    this.$store.state.basicPH = this.offset;
                    this.$emit('proceed',true);
                })
                .catch(error => {
                    console.log(error)
                })
            }   
            if(this.calibrationType === 'conductivity'){
                this.$store.state.conductivity = this.offset;
                console.log(`Saving ${this.calibrationType} offset value: ${this.offset}`)
                this.$emit('loading',true);
                await APICalls.setConductivityCalibration(this.$store.state.currentGreenhouse, this.offset, this.$store.state.user.token)
                .then( response => {
                    this.$store.state.conductivity = this.offset;
                    console.log(response)
                })
                .catch(error => {
                    console.log(error)
                })
            }
            this.$emit('proceed',true);        
        }
    }
}
</script>

<style>

</style>