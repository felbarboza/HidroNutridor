import SensorData from 'infra/typeorm/entities/SensorData';
import { getRepository } from 'typeorm';
import WebSocket from 'ws';


export default class CalibrateConductivityService {

    private static _instance:CalibrateConductivityService = new CalibrateConductivityService();

    coeficient:number = 0;
    conductivity:number = 0;
    conductivity_right:number = 0
    pode_mandar_socket:number = 0

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
                    take: 5
            });

            const adc_ec_values = activatePumpHistory.map((sensorData)=>{
                return Math.round(sensorData.adc_ec)
            })

            if(adc_ec_values.every( (val, i, arr) => val === arr[0] )){
                this.conductivity = adc_ec_values[0]
                estabilizou=true
            }
            await new Promise(f => setTimeout(f, 1000));
        }
        return;
	}

    public async verifyECCalibration(ws: WebSocket): Promise<void> {
        if(this.pode_mandar_socket==1){
            this.coeficient = (this.conductivity_right/this.conductivity)
            
            const obj_retorno = {
                "type": "coef_ec",
                "a": this.coeficient,
            }
    
            ws.send(JSON.stringify(obj_retorno))
            this.pode_mandar_socket=0
            return;
        }
        else{
            return
        }
	}
}