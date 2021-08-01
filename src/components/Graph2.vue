<template>
<v-container>
    <v-card :color="this.color">
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
            <VueApexCharts ref="chart" width="500" type="line" :options="options" :series="series"></VueApexCharts>
        </v-card-text>

        <v-card-text class="text-center">
        <div class="display-1">{{ this.title }}</div>
        </v-card-text>
  </v-card>
  
</v-container>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
export default {
    components:{VueApexCharts},
    data: function() {
        return {
            options: {
                id: 'realtime',
                xaxis: {
                    categories: this.timestamps,
                    range: 10,
                },
                colors: ["#FFFFFF"],
                animations: {
                    enabled: true,
                    easing: 'linear',
                    dynamicAnimation: {
                        speed: 1000
                    }
              },
              toolbar: {
                show: false
              },
            },
            series: [{
                name: this.title,
                data: this.values
            }],
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
        },
    },
    created(){
        this.setReadingUnit();
    },
    computed: {
        lastReading: function() {
            return this.values ? this.values[this.values.length-1] : 0; 
        }
    },
    watch: {
        readings: function () {
        this.readingsCopy = this.readings.slice();

        // if (this.readingsCopy.length > 10) {
        //     this.values.splice(0,this.readingsCopy.length-10);

        //     this.readingsCopy.splice(0,this.readingsCopy.length-10); 
        //     //console.log(this.readingsCopy)
        // }
        // if( this.timestamps.length > 10) {
        //     this.timestamps.splice(0,this.timestamps.length-10)
        //     console.log('timestamps')
        //     console.log(this.timestamps)
        // }
        this.setValueType();
        let me = this
        let xaxis = {
            categories: this.timestamps
        }
        this.$refs.chart.updateSeries([{
              data: me.values
            }])
        this.$refs.chart.updateOptions({ xaxis: xaxis})
        }
        
    },
    // mounted() {
    //     console.log(this.values)
    //     console.log(this.$refs.chart);
    // },
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
            this.timestamps.push(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
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
