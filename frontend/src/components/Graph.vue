<template>
  <v-card :color="this.color" dark>
    <v-card-title>
      <!-- <v-icon
        :color="checking ? 'red lighten-2' : 'indigo'"
        class="mr-12"
        size="64"
        @click="takePulse"
      >
        mdi-heart-pulse
      </v-icon> -->
      <v-row align="start">
        <div class="white--text text-uppercase pr-2 pl-2">
          Última leitura:
        </div>
        <div>
          <strong v-if="lastReading">{{`${lastReading+readingUnit}`}}</strong>
        </div>
      </v-row>

      <v-spacer></v-spacer>

      <!-- <v-btn icon class="align-self-start" size="28">
        <v-icon>mdi-arrow-right-thick</v-icon>
      </v-btn> -->
    </v-card-title>
    <v-card-text>
      <v-sparkline
        :value="values"
        :labels="timestamps"
        color="rgba(255, 255, 255, .7)"
        height="100"
        padding="24"
        stroke-linecap="round"
        smooth
      />
    </v-card-text>

    <v-card-text class="text-center">
      <div class="display-1">{{ this.title }}</div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'Graph',
  data() {
    return {
      values: [],
      timestamps: [],
      readingUnit: '-',
      readingsCopy: this.readings,
    }
  },
  props: {
    readings: {
      type: Array,
      required: true
    },
    readingType: {
      type: String,
      required: true
    },
    color: {
      type: String
    },
    title: {
      type: String
    }
  },
  created(){
    // console.log('readings')
    // console.log(this.readings);
  },
  computed: {
    lastReading: function() {
        return this.values ? this.values[this.values.length-1] : 0; 
    }
  },
  watch: {
    readings: function () {
      this.readingsCopy = this.readings.slice();

      if (this.readingsCopy.length > 6) {
        this.values.splice(0,this.readingsCopy.length-6);

        this.readingsCopy.splice(0,this.readingsCopy.length-6); 
        //console.log(this.readingsCopy)
      }
      if(this.timestamps.length > 6) {
        this.timestamps.splice(0,this.timestamps.length-6)
        //console.log(this.timestamps)
      }
      this.setValueType();
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.setValueType();
      this.setReadingUnit();
      
      // console.log('values')
      // console.log(this.values);
      // console.log(typeof(this.values[0]));
    })
  },
  methods: {
    setValueType() {
      this.readingsCopy.forEach(e => {
        if (this.readingType === 'ph') {
        this.values.push(parseFloat(e.ph));
        }
        if (this.readingType === 'temperature') {
          this.values.push(parseFloat(e.temperature));
        }
        if (this.readingType === 'conductivity') {
          this.values.push(parseFloat(e.conductivity));
        }
        let date = new Date(e.created_at);
        this.timestamps.push(`${date.getHours()}:${date.getMinutes()}`)
      });
    },
    setReadingUnit() {
      if (this.readingType === 'ph') {
        this.readingUnit = ''
      }
      if (this.readingType === 'temperature') {
        this.readingUnit = '°C'
      }
      if (this.readingType === 'conductivity') {
        this.readingUnit = 'μS/cm'
      }
    },
  }
}
</script>