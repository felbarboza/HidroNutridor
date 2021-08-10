import ActivationTime from 'infra/typeorm/entities/ActivationTime';
import { getRepository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import WebSocket from 'ws';

interface ActivateTimeDTO{
    estufa_id: number;
    hour_time_on: number;
    minute_time_on: number;
    hour_time_off: number;
    minute_time_off: number;
}

class ManageActivationTimeService {
    status:string

    constructor(){
        this.status="on"
    }
	public async execute(ws: WebSocket): Promise<void> {
        const now = new Date()
        const now_hour = now.getHours()
        const now_minute = now.getMinutes()
        // console.log(now_hour, now_minute)
        const sensorDataRepository = getRepository(ActivationTime)

        const sensorData = await sensorDataRepository.findOne({
            where:{
                hour_time_on: LessThanOrEqual(now_hour),
                minute_time_on: LessThanOrEqual(now_minute),
                hour_time_off: MoreThanOrEqual(now_hour),
                minute_time_off: MoreThanOrEqual(now_minute)
            }
        });
        // console.log(sensorData)

        if(!sensorData){
            const obj_retorno={
                "type": "pump",
                "cmd": "off"
            }
            if(this.status=="on"){
                this.status="off"
                ws.send(JSON.stringify(obj_retorno))
            }
        }else{
            const obj_retorno={
                "type": "pump",
                "cmd": "on"
            }
            if(this.status=="off"){
                this.status="on"
                ws.send(JSON.stringify(obj_retorno))
            }
        }
        return
	}
}

export default ManageActivationTimeService;