import SensorData from 'infra/typeorm/entities/SensorData';
import { getRepository } from 'typeorm';
import WebSocket from 'ws';
import AppError from 'errors/AppError';


export default class CalibratePhService {

    private static _instance:CalibratePhService = new CalibratePhService();
    ws: WebSocket
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
        const obj_retorno = {
            "type": "adj",
            "cmd": "off"
        }
        this.ws.send(JSON.stringify(obj_retorno))
        await new Promise(f => setTimeout(f, 10000));
        this.ph_low = ph
        console.log(ph)
        const activatePumpRepository = getRepository(SensorData)
        let estabilizou = false
        let i = 0
        while(estabilizou==false){

            const activatePumpHistory = await activatePumpRepository.find({
                
                    where: {
                        greenhouse_id: estufa_id
                    }, 
                    order:{
                        created_at: "DESC"	
                    },
                    take: 10
            });

            const adc_ph_values = activatePumpHistory.map((sensorData)=>{
                return Math.round(sensorData.adc_ph)
            })
            console.log(adc_ph_values)
            if(adc_ph_values.every( (val, i, arr) => (val === arr[0]) )){
                this.adc_ph_low = adc_ph_values[0]
                estabilizou=true
                console.log('estabilizou')
            }
            await new Promise(f => setTimeout(f, 1000));
            i+=1
            if(i==30){
                throw new AppError('Não estabilizou amigao')
            }
        }
        return;
	}

    public async calibrateHighPh(estufa_id: number, ph: number): Promise<void> {
        await new Promise(f => setTimeout(f, 5000));
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
                    take: 10
            });

            const adc_ph_values = activatePumpHistory.map((sensorData)=>{
                return Math.round(sensorData.adc_ph)
            })

            console.log(adc_ph_values)
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
        this.ws = ws
        if(this.pode_mandar_socket==1){
            this.pode_mandar_socket=0
            await new Promise(f => setTimeout(f, 20000));
            console.log(this.ph_low, this.ph_high, this.adc_ph_high, this.adc_ph_low)
            this.a = ((this.ph_high-this.ph_low)/(this.adc_ph_high-this.adc_ph_low))
            this.b = (Number(-1*this.a*this.adc_ph_low)+Number(this.ph_low))
            console.log(this.a, this.b)
            const obj_retorno = {
                "type": "coef_ph",
                "a": this.a,
                "b": this.b
            }
    
            ws.send(JSON.stringify(obj_retorno))
            const obj_retorno2 = {
                "type": "adj",
                "cmd": "on"
            }
            this.ws.send(JSON.stringify(obj_retorno2))
            return;
        }
        else{
            return;
        }
	}
}