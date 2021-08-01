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
            this.dialog = true;
            this.isEditing = true;
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
        saveValue() {
            this.isEditing = false;
            this.formValidity = false;
            if(this.calibrationType === 'acidPh'){
                console.log(`Saving ${this.calibrationType} offset value: ${this.offset}`)
            }
            if(this.calibrationType === 'basicPh'){
                console.log(`Saving ${this.calibrationType} offset value: ${this.offset}`)
            }   
            if(this.calibrationType === 'conductivity'){
                console.log(`Saving ${this.calibrationType} offset value: ${this.offset}`)
            }        
        }
    }
}
</script>

<style>

</style>