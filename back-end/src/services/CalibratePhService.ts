import SensorData from 'infra/typeorm/entities/SensorData';
import { getRepository } from 'typeorm';
import WebSocket from 'ws';


export default class CalibratePhService {

    private static _instance:CalibratePhService = new CalibratePhService();

    a:number = 0;
    b:number = 0;
    ph_low:number = 0;
    ph_high:number = 0;
    adc_ph_low:number = 0
    adc_ph_high:number = 0
    pode_mandar_socket:number = 0

    constructor() {
        if(CalibratePhService._instance){
            throw new Error("Error: Instantiation failed: Use CalibratePhService.getInstance() instead of new.");
        }
        CalibratePhService._instance = this;
    }

    public static getInstance():CalibratePhService
    {
        return CalibratePhService._instance;
    }

    public async calibrateLowPh(estufa_id: number, ph: number): Promise<void> {
        this.ph_low = ph
        console.log(ph)
        const activatePumpRepository = getRepository(SensorData)
        let estabilizou = false
        while(estabilizou==false){

            const activatePumpHistory = await activatePumpRepository.find({
                
                    where: {
                        greenhouse_id: estufa_id
                    }, 
                    order:{
                        created_at: "DESC"	
                    },
                    take: 5
            });

            const adc_ph_values = activatePumpHistory.map((sensorData)=>{
                return Math.round(sensorData.adc_ph)
            })

            if(adc_ph_values.every( (val, i, arr) => val === arr[0] )){
                this.adc_ph_low = adc_ph_values[0]
                estabilizou=true
                console.log('estabilizou')
            }
            await new Promise(f => setTimeout(f, 1000));
        }
        return;
	}

    public async calibrateHighPh(estufa_id: number, ph: number): Promise<void> {
        this.ph_high = ph
        console.log(ph)
        const activatePumpRepository = getRepository(SensorData)
        let estabilizou = false
        while(estabilizou==false){

            const activatePumpHistory = await activatePumpRepository.find({
                
                    where: {
                        greenhouse_id: estufa_id
                    }, 
                    order:{
                        created_at: "DESC"	
                    },
                    take: 5
            });

            const adc_ph_values = activatePumpHistory.map((sensorData)=>{
                return Math.round(sensorData.adc_ph)
            })

            if(adc_ph_values.every( (val, i, arr) => val === arr[0] )){
                this.adc_ph_high = adc_ph_values[0]
                estabilizou=true
                console.log('estabilizou')
            }
            await new Promise(f => setTimeout(f, 1000));
        }
        this.pode_mandar_socket=1
        return;
	}

    public async verifyPhCalibration(ws: WebSocket): Promise<void> {
        if(this.pode_mandar_socket==1){

            this.a = ((this.ph_high-this.ph_low)/(this.adc_ph_high-this.adc_ph_low))
            this.b = ((this.a*this.adc_ph_low)+this.ph_low)
            const obj_retorno = {
                "type": "coef_ph",
                "a": this.a,
                "b": this.b
            }
    
            ws.send(JSON.stringify(obj_retorno))
            this.pode_mandar_socket=0
            return;
        }
        else{
            return;
        }
	}
}