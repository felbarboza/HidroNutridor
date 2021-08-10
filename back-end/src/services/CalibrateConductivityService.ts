import SensorData from 'infra/typeorm/entities/SensorData';
import { getRepository } from 'typeorm';
import WebSocket from 'ws';


export default class CalibrateConductivityService {

    private static _instance:CalibrateConductivityService = new CalibrateConductivityService();

    coeficient:number = 0;
    conductivity:number = 0;
    conductivity_right:number = 0
    pode_mandar_socket:number = 0
    ws: WebSocket

    constructor() {
        if(CalibrateConductivityService._instance){
            throw new Error("Error: Instantiation failed: Use CalibrateConductivityService.getInstance() instead of new.");
        }
        CalibrateConductivityService._instance = this;
    }

    public static getInstance():CalibrateConductivityService
    {
        return CalibrateConductivityService._instance;
    }

    public async calibrate(estufa_id: number, conductivity: number): Promise<void> {
        const obj_retorno2 = {
            "type": "adj",
            "cmd": "off"
        }
        this.ws.send(JSON.stringify(obj_retorno2))
        await new Promise(f => setTimeout(f, 10000));
        
        this.conductivity_right = conductivity
        
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
            let biggerAdc = 0
            let lowerAdc = 9999999
            activatePumpHistory.forEach((sensorData)=>{
                if(sensorData.adc_ec>biggerAdc){
                    biggerAdc=sensorData.adc_ec;
                }
                if(sensorData.adc_ec<lowerAdc){
                    lowerAdc=sensorData.adc_ec
                }
            })
            if((biggerAdc-lowerAdc)<=50){
                console.log(biggerAdc, lowerAdc)
                this.conductivity = (Number(biggerAdc)+Number(lowerAdc))*(0.5)
                console.log(this.conductivity)
                estabilizou=true
                console.log('estabilizou')
                this.pode_mandar_socket=1
            }
            await new Promise(f => setTimeout(f, 1000));
        }
        return;
	}

    public async verifyECCalibration(ws: WebSocket): Promise<void> {
        this.ws = ws
        if(this.pode_mandar_socket==1){
            this.pode_mandar_socket=0
            await new Promise(f => setTimeout(f, 10000));
            console.log(this.conductivity_right, this.conductivity)
            this.coeficient = Number(this.conductivity_right/this.conductivity)
            
            const obj_retorno = {
                "type": "coef_ec",
                "a": this.coeficient,
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
            return
        }
	}
}