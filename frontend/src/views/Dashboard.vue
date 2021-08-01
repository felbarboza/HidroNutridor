<template>
  <v-container>
    <v-row>
      <!-- <v-col v-for="reading in this.readings" :key="`${reading.id}`">
        <Graph :reading="reading"/>
      </v-col> -->
      <!-- <v-col>
        <Graph :readings="readings" readingType="ph" color="cyan" title="pH" :key='refresh'/> 
      </v-col>
      <v-col>
        <Graph :readings="readings" readingType="temperature" color="teal" title="Temperatura" :key='refresh'/> 
      </v-col>
      <v-col>
        <Graph :readings="readings" readingType="conductivity" color="green" title="Condutividade" :key='refresh'/> 
      </v-col> -->
      <v-col>
        <Graph2 :readings="readings" readingType="ph" color="cyan" title="pH"/> 
      </v-col>
      <v-col>
        <Graph2 :readings="readings" readingType="temperature" color="teal" title="Temperatura"/> 
      </v-col>
      <v-col>
        <Graph2 :readings="readings" readingType="conductivity" color="green" title="Condutividade"/> 
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-dialog
            v-model="dialog"
            persistent
            max-width="600px"
          >
            <v-card>
              <v-card-title>
                <span class="text-h5">Nova Estufa</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-form refs="signupForm" v-model="formValidity">
                          <v-text-field label="Nome da estufa" type="text" v-model="greenhouseName" :rules="nameRules" required>
                          </v-text-field>
                          <!-- <v-text-field label="Login" type="text" v-model="login" :rules="nameRules" required>
                          </v-text-field>
                          <v-text-field label="Password" type="text" v-model="password" :rules="nameRules" required>
                          </v-text-field> -->
                      </v-form>
                  </v-col> 
                  </v-row>
                </v-container>
              </v-card-text>
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
                  :disabled="!formValidity"
                  text 
                  @click="createGreenhouse"
                >
                  Salvar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :headers="greenhouseHeaders"
          :items="greenHouses"
          class="elevation-1"
          :search="search"
          :key="refresh"
        >
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>Estufas</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-row>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Buscar"
                  single-line
                  hide-details
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-select
                  v-model="select"
                  :items="greenHouses"
                  item-text="name"
                  item-value="id"
                  label="Estufa Selecionada"
                  return-object
                  @change="updateData"
                ></v-select>
                <v-spacer></v-spacer>
                <v-btn 
                  color="info"
                  @click="dialog=!dialog"
                  tile
                  >
                  Criar Nova Estufa
                </v-btn>
              </v-row>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5">Tem certeza de que quer deletar a estufa?</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogDelete=false">Cancelar</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm">Confirmar</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          dense
          :headers="headers"
          :items="readings"
          :items-per-page="5"
          class="elevation-1"
          @click:row="selectRow"
        >
        <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>Leituras</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-row>
                <v-col>
                  <v-switch
                    v-model="autoUpdate"
                    :label="`Habilitar Atualização Automática`"
                  ></v-switch>
                </v-col>
                <v-text-field
                  class="shrink" 
                  label="Taxa de atualização (s)" 
                  type="number" 
                  v-model="updateRate" 
                  :rules="numberRules"
                  >
                </v-text-field>
              </v-row>
            </v-toolbar>
         </template>
        <template v-slot:[`item.created_at`]='{ item }'>
           {{formatDate(item.created_at)}}
        </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="snackbar"
    >
      {{ currentItem }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    </v-container>
</template>

<script>
import APICalls from '@/services/APICalls.js'
import Graph2 from '../components/Graph2.vue'

  export default {
  components: { Graph2 },
    data () {
      return {
        autoUpdate: false,
        dialog: false,
        dialogDelete: false,
        greenHouses: [],
        greenhouseName: '',
        timerId: null,
        updateRate: 10,
        // greenHouseId: 1,
        editedIndex: -1,
        editedItem: {},
        readings: [],
        refresh: 0,
        currentItem: '',
        snackbar: false,
        headers: [
            //{text: 'Id', value: 'id'},
            {text: 'Data', value: 'created_at'},   
            {text: 'Temperatura', value: 'temperature'},
            {text: 'pH', value: 'ph'},
            {text: 'Condutividade', value: 'conductivity'},   
        ],
        greenhouseHeaders: [
          {text: 'Id', value:'id'},
          {text: 'Nome', value:'name'},
          {text: 'Ações', value: 'actions', sortable: false },
        ],
        select: { id: 0 , name: '' },
        nameRules: [
                v => !!v || 'Este campo é obrigatório'
        ],
        numberRules: [
                v => (parseInt(v)>=1) || 'O número deve ser maior do que 0'
        ],
        formValidity: false,
        search:'',
      }
    },
    watch: {
      select: {
        handler: function () {
          this.$store.dispatch('setCurrentGreenhouse', this.select.id);
          this.refresh+=1;
        },
        deep: true
      },
      autoUpdate: function(value) {
        if(value) {
          this.startAutoUpdate();
        } else {
          clearInterval(this.timerId);
        }
      }
    },
    methods: {
        selectRow(event){
            this.snackbar = true
            this.currentItem = event.name
        },
        // showSensorData() {
        //     APICalls.getSensorData()
        //   .then( response => {
        //     console.log(response.data)
        //   })
        //   .catch(error => {
        //     console.log(error)
        //   })
        // },
        listGreenhouses() {
          APICalls.getGreenHouse(this.$store.state.user.token)
          .then( response => {
            this.greenHouses = response.data.greenHouses
          })
          .catch(error => {
            console.log(error)
          })
        },
        createGreenhouse() {
          this.dialog = false;
          APICalls.setGreenHouse({name: this.greenhouseName}, this.$store.state.user.token)
          .then( response => {
            console.log(response)
            this.listGreenhouses();
          })
          .catch(error => {
            console.log(error)
          })
        },
        deleteItem(item) {
          this.dialogDelete = true;
          this.editedIndex = this.greenHouses.indexOf(item)
          this.editedItem = Object.assign({}, item)
        },
        deleteItemConfirm() {
          this.dialogDelete = false;
          this.greenHouses.splice(this.editedIndex, 1)
          //TODO: insert delete method here
          console.log(`deleting ${this.editedItem}`);
          console.log(this.editedItem);
        },
        updateData() {
          this.$store.dispatch('setCurrentGreenhouse', this.select.id);
          this.getSensorData();
          this.refresh+=1;
          // setTimeout(() => {
          //   this.refresh+=1
          // },3000)
        },
        startAutoUpdate() {
          this.timerId = setInterval(() => {
            APICalls.getSensorData(this.select.id,this.$store.state.user.token)
          .then( response => {
            // this.readings = response.data.sensorData
            // this.readings.push(...response.data.sensorData)
            this.randomReadings();
            console.log(response)
            console.log(this.readings)
            console.log(this.readings.length)
          })
          .catch(error => {
            console.log(error)
          });
          this.refresh+=1;
          },(parseInt(this.updateRate) >=1 ? parseInt(this.updateRate) : 10)*1000)
        },
        getSensorData() {
            APICalls.getSensorData(this.select.id,this.$store.state.user.token)
          .then( response => {
            this.readings = response.data.sensorData
            console.log(this.readings)
          })
          .catch(error => {
            console.log(error)
          });
        },
        randomReadings() {
          this.readings.push({
            temperature:(Math.random() * (37 - 36) + 36).toFixed(2),
            ph: (Math.random() * (8 - 6) + 6).toFixed(2),
            conductivity: (Math.random() * (2 - 1) + 1).toFixed(2),
            greenhouse_id: this.select.id,
            created_at: new Date()
          })
        },
        formatDate(item) {
          let date = new Date(item);
          console.log(date.getDay())
          return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }
    },
    created() {
      this.listGreenhouses();
    },
    mounted() {
      // APICalls.getEmployees()
      //   .then( response => {
      //     this.employees = response.data
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   }),
        // setInterval(() => {
        //   APICalls.getSensorData(this.select.id,this.$store.state.user.token)
        // .then( response => {
        //   this.readings = response.data.sensorData
        //   console.log(this.readings)
        // })
        // .catch(error => {
        //   console.log(error)
        // });
        // this.refresh+=1;
        // },10000)
        
    }
  }
</script>
<style>

</style>