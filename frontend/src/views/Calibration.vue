<template>
  <div>
      <v-container>
          <v-container>
          <v-row>
              <v-col>
                  <ReadingsCard :reading="{title: 'pH', value: reading.ph}"/>
              </v-col>
              <v-col>
                  <ReadingsCard :reading="{title: 'Temperatura (°C)', value: reading.temperature}"/>
              </v-col>
              <v-col>
                  <ReadingsCard :reading="{title: 'Condutividade (μS/cm)', value: reading.conductivity}"/>
              </v-col>
          </v-row>
          </v-container>
          <v-row>
              <v-col cols="6">
                  <v-container>
                  <v-card>
                    <v-card-title>{{"Horário de Ativcação da Bomba Principal"}}</v-card-title>
                    <v-form
                        v-model="formValidity"
                        :disabled="!isEditingTime"
                    >   
                        <template>
                            <v-row>
                                <v-col
                                    cols="4"
                                >
                                    <v-menu
                                        ref="menu1"
                                        v-model="menu1"
                                        :close-on-content-click="false"
                                        :return-value.sync="activationTime"
                                        transition="scale-transition"
                                        offset-y
                                        max-width="290px"
                                        min-width="290px"
                                    >
                                        <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            class="shrink pl-10"
                                            v-model="activationTime"
                                            label="Horário de Ativação"
                                            prepend-icon="mdi-clock-time-four-outline"
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                            :rules="activationRules" 
                                            required
                                        ></v-text-field>
                                        </template>
                                        <v-time-picker
                                            v-if="menu1"
                                            v-model="activationTime"
                                            full-width
                                            @click:minute="$refs.menu1.save(activationTime)"
                                        ></v-time-picker>
                                    </v-menu>
                                </v-col>
                                <v-col
                                    cols="4"
                                >
                                    <v-menu
                                        ref="menu2"
                                        v-model="menu2"
                                        :close-on-content-click="false"
                                        :nudge-right="40"
                                        :nudge-left="40"
                                        :return-value.sync="deActivationTime"
                                        transition="scale-transition"
                                        offset-y
                                        max-width="290px"
                                        min-width="290px"
                                    >
                                        <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            class="shrink pl-10"
                                            v-model="deActivationTime"
                                            label="Horário de Desativação"
                                            prepend-icon="mdi-clock-time-four-outline"
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                            :rules="deActivationRules" 
                                            required
                                        ></v-text-field>
                                        </template>
                                        <v-time-picker
                                            v-if="menu2"
                                            v-model="deActivationTime"
                                            full-width
                                            @click:minute="$refs.menu2.save(deActivationTime)"
                                        ></v-time-picker>
                                    </v-menu>
                                </v-col>
                            </v-row>
                        </template>
                    </v-form>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                            <v-btn
                                color="blue darken-1"
                                text
                                @click="editTime()"
                            >
                            Editar
                            </v-btn>
                            <v-btn 
                                color="blue darken-1"
                                :disabled="!formValidity"
                                text 
                                @click="saveTime()"
                            >
                            Salvar
                            </v-btn>
                    </v-card-actions>
                  </v-card>
                  </v-container>
              </v-col>
              <v-col cols="6"> 
                <CalibrationCard 
                    label="Offset de condutividade" 
                    title="Calibragem de condutividade" 
                    calibrationType="conductivity"
                    message="Insira o sensor de condutividade na solução"
                />
              </v-col>
          </v-row>
          <v-row>
              <v-col cols="6"> 
                <CalibrationCard 
                    label="Offset de pH ácido" 
                    title="Calibragem de pH: solução ácida" 
                    calibrationType="acidPH"
                    message="Insira o sensor de pH na solução ácida"
                />
              </v-col>
              <v-col cols="6"> 
                <CalibrationCard 
                    label="Offset de pH básico" 
                    title="Calibragem de pH: solução básica" 
                    calibrationType="basicPH"
                    message="Insira o sensor de pH na solução básica"
                />
              </v-col>
          </v-row>
      </v-container>
  </div>
</template>

<script>
import ReadingsCard from '../components/ReadingsCard.vue'
import CalibrationCard from '../components/CalibrationCard.vue'
export default {
    components: { ReadingsCard, CalibrationCard},
    data() {
        return {
            activationTime: null,
            deActivationTime: null,
            menu1: false,
            menu2: false,
            reading: {},
            isEditingTime: false,
            formValidity: false,
            activationRules:[
                v => !!v || 'Este campo é obrigatório',
                v => !(v == this.deActivationTime) || 'Horários inválidos' 
            ],
            deActivationRules:[
                v => !!v || 'Este campo é obrigatório',
                v => !(v == this.activationTime) || 'Horários inválidos' 
            ]
        }
    },
    created() {
        setInterval(() => {
                this.randomReadings();
        }, 500);
    },
    methods: {
        randomReadings() {
          this.reading = {
            temperature:(Math.random() * (37 - 36) + 36).toFixed(2),
            ph: (Math.random() * (8 - 6) + 6).toFixed(2),
            conductivity: (Math.random() * (2 - 1) + 1).toFixed(2),
            greenhouse_id: 1,
            created_at: new Date()
          }
        },
        editTime() {
            this.isEditingTime = true;
            console.log("editing activation time");
        },
        saveTime() {
            this.isEditingTime = false;
            this.formValidity = false;
            console.log("saving activation time");
        }
    }
}
</script>

<style>

</style>