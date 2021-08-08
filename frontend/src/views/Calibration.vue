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
              <v-col cols="12"> 
                <CalibrationCard 
                    label="Offset de condutividade" 
                    title="Calibragem de condutividade" 
                    calibrationType="conductivity"
                    message="Insira o sensor de condutividade na solução"
                />
              </v-col>
          </v-row>
          <v-row>
              <v-col>
                  <v-container>
                      <v-card>
                      <v-card-title>{{"Calibragem de pH"}}</v-card-title>
                        <v-form
                            readonly
                        >
                            <template>
                                <v-row>
                                    <v-col cols="3">
                                        <v-text-field
                                                :key='refreshPH'
                                                class="shrink pl-10"
                                                :value="this.$store.state.acidicPH"
                                                label="Valor de Referência: pH ácido"
                                                readonly
                                            >
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="3">
                                        <v-text-field
                                                :key='refreshPH'
                                                class="shrink pl-10"
                                                :value="this.$store.state.basicPH"
                                                label="Valor de Referência: pH básico"
                                                readonly
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
                                    @click="dialog=true"
                                >
                                Calibrar
                                </v-btn>
                            </v-card-actions>
                      </v-card>
                  </v-container>
              </v-col>
          </v-row>
          <v-row>
              <v-col cols="12">
                  <v-container>
                  <v-card>
                    <v-card-title>{{"Horário de Ativação da Bomba Principal"}}</v-card-title>
                    <v-form
                        v-model="formValidity"
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
            </v-row>
          <v-row>
            <v-col>
                <v-container>
                    <v-data-table
                        :headers="headers"
                        :items="items"
                        class="elevation-1"
                        :key="refresh"
                    >
                        <template v-slot:item.actions="{ item }">
                            <v-icon
                                small
                                @click="deleteItem(item)"
                            >
                                mdi-delete
                            </v-icon>
                        </template>
                    </v-data-table>
                </v-container>
            </v-col>
          </v-row>
            <v-dialog
                v-model="dialog"
                persistent
                max-width="600px"
            >
                <CalibrationSteps
                    @complete-calibration='calibrationComplete'
                    @cancel='dialog=false'
                />
            </v-dialog>
      </v-container>
      <v-snackbar
        v-model="invalidTime"
        color="red accent-4"
        >
        {{ errorMessage }}

        <template v-slot:action="{ attrs }">
            <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="invalidTime = false"
            >
            Fechar
            </v-btn>
        </template>
    </v-snackbar>
  </div>
</template>

<script>
import ReadingsCard from '../components/ReadingsCard.vue'
import CalibrationCard from '../components/CalibrationCard.vue'
import CalibrationSteps from '../components/CalibrationSteps.vue'
import APICalls from '@/services/APICalls.js'

export default {
    components: { ReadingsCard, CalibrationCard, CalibrationSteps},
    data() {
        return {
            activationTime: null,
            deActivationTime: null,
            menu1: false,
            menu2: false,
            reading: {},
            isEditingTime: false,
            formValidity: false,
            invalidTime: false,
            activationTimes:[],
            items:[],
            dialog: false,
            errorMessage:'',
            refresh: 0,
            refreshPH: 0,
            activationRules:[
                v => !!v || 'Este campo é obrigatório',
                v => !(v == this.deActivationTime) || 'Horários inválidos' 
            ],
            deActivationRules:[
                v => !!v || 'Este campo é obrigatório',
                v => !(v == this.activationTime) || 'Horários inválidos' 
            ],
            headers:[
                {text:'Horário de Ativação', value:'activationTime'},
                {text:'Horário de Desativação', value:'deActivationTime'},
                {text: 'Ações', value: 'actions', sortable: false },
            ]
        }
    },
    created() {
        if(this.$store.state.currentGreenhouse) {
            this.getActivationTimes();
            console.log('created 1')
            console.log(this.activationTimes)
            console.log('created 2')
            this.refresh+=1;
            let timerId = setInterval(() => {
                this.getLiveSensorData();
            }, 1000);
            this.$store.state.activeTimers.push(timerId);
        }       
    },
    watch: {
        activationTimes: {
            handler: function () {
                if(this.activationTimes.length > 0) {
                    this.items = 
                    this.activationTimes.map( e => {
                            return {id: e.id,
                                    activationTime   : `${this.formatTime(e.hour_time_on)}:${this.formatTime(e.minute_time_on)}`,
                                    deActivationTime : `${this.formatTime(e.hour_time_off)}:${this.formatTime(e.minute_time_off)}`}
                    })
                    console.log('items')
                    console.log(this.items)
                }            
            },
            deep: true
        }
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
        // editTime() {
        //     this.isEditingTime = true;
        //     console.log("editing activation time");
        // },
        saveTime() {
            console.log("saving activation time");
            console.log(this.activationTime + typeof(this.activationTime));
            let timeOn = ''
            let timeOff = ''
            for (let i=0;i<this.activationTimes.length;i++) {
                timeOn = `${this.formatTime(this.activationTimes[i].hour_time_on)}:${this.formatTime(this.activationTimes[i].minute_time_on)}`
                timeOff = `${this.formatTime(this.activationTimes[i].hour_time_off)}:${this.formatTime(this.activationTimes[i].minute_time_off)}`
                if( timeOn===this.activationTime 
                    || timeOff===this.deActivationTime 
                    || (this.activationTime>timeOn && this.deActivationTime<timeOff) 
                    || (this.activationTime<timeOn && this.deActivationTime>timeOff)
                    || (this.activationTime>timeOn && this.activationTime<timeOff)
                    || (this.deActivationTime>timeOn && this.deActivationTime<timeOff))
                {
                    this.invalidTime = true;
                    this.errorMessage = 'Erro: conflito de horários'
                    console.log(this.errorMessage)
                    break;
                }
            }
            if(!this.invalidTime) {
                let hourOn =  parseInt(this.activationTime.substring(0,2))
                let minuteOn = parseInt(this.activationTime.substring(3,5))
                let hourOff = parseInt(this.deActivationTime.substring(0,2))
                let minuteOff = parseInt(this.deActivationTime.substring(3,5))
                console.log(this.$store.state.user.token)
                APICalls.setActivationTime(this.$store.state.currentGreenhouse,hourOn,minuteOn,hourOff,minuteOff,this.$store.state.user.token)
                this.getActivationTimes();
            }                
        },
        deleteItem(item) {
            console.log(item.id)
            APICalls.deleteActivationTime( item.id, this.$store.state.user.token)
            .then(response =>{ 
                console.log(response)
                this.getActivationTimes();
             })
            .catch(error => 
                console.log(error))
        },
        getActivationTimes() {
            APICalls.getActivationTimes( this.$store.state.currentGreenhouse, this.$store.state.user.token)
            .then(response =>{ 
                console.log(response.data)
                this.activationTimes = response.data.activationsTime
                this.refresh+=1})
            .catch(error => 
                console.log(error))
        },
        formatTime(time){
            if(time>=0 && time <10){
                return time.toString().padStart(2,'0');
            }
            return time
        },
        calibrationComplete() {
            this.dialog=false
            this.refreshPH+=1
            console.log("ph ácido " + this.$store.state.acidicPH)
        },
        getLiveSensorData() {
            APICalls.getSensorData(this.$store.state.currentGreenhouse,1,this.$store.state.user.token)
            .then( response => {
                if(response.data.sensorData[0].id === this.reading.id) {
                    this.reading = {
                        temperature: '-',
                        ph: '-',
                        conductivity: '-',
                        //id: response.data.sensorData[0].id
                    }
                } else {
                    this.reading = response.data.sensorData[0]
                }     
                console.log(response)
            })
            .catch( error => {
                console.log('erro '+ error)
                this.reading = {
                        temperature: '-',
                        ph: '-',
                        conductivity: '-',
                    }
            });
        },
    }
}
</script>

<style>

</style>