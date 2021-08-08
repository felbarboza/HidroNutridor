<template>
    <v-container>
        <v-stepper v-model="step">
            <v-stepper-header>
            <v-stepper-step
                :complete="step > 1"
                step="1"
            >
                Calibrar pH ácido
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step
                :complete="step > 2"
                step="2"
            >
                Calibrar pH básico
            </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
            <v-stepper-content step="1">
                <!-- <v-card
                class="mb-12"
                color="grey lighten-1"
                height="200px"
                ></v-card> -->
                <CalibrationCard 
                    label="Offset de pH ácido" 
                    title="Calibragem de pH: solução ácida" 
                    calibrationType="acidPH"
                    message="Insira o sensor de pH na solução ácida"
                    @proceed='proceed=true, loading=false'
                    @loading='loading=true'
                />
                <v-btn
                :disabled='!proceed'
                :loading='loading'
                color="primary"
                @click="step = 2, proceed=false"
                >
                Continuar
                </v-btn>

                <v-btn 
                    text
                    @click="$emit('cancel')"  
                >
                Cancelar
                </v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
                <!-- <v-card
                class="mb-12"
                color="grey lighten-1"
                height="200px"
                ></v-card> -->
                <CalibrationCard 
                    label="Offset de pH básico" 
                    title="Calibragem de pH: solução básica" 
                    calibrationType="basicPH"
                    message="Insira o sensor de pH na solução básica"
                    @proceed='proceed=true, loading=false'
                    @loading='loading=true'
                />
                <v-btn
                    :disabled='!proceed'
                    :loading='loading'
                    color="primary"
                    @click="endCalibration"
                >
                Finalizar
                </v-btn>

                <v-btn 
                    text
                    @click="$emit('cancel')"  
                >
                Cancelar
                </v-btn>
            </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </v-container>
</template>

<script>
import CalibrationCard from '../components/CalibrationCard.vue'
export default {
    components:{CalibrationCard},
    data() {
        return {
            step: 1,
            proceed: false,
            loading: false,
        }
    },
    methods: {
        endCalibration() { 
            this.$emit('complete-calibration')
            this.step = 1;
        }
    }
}
</script>

<style>

</style>