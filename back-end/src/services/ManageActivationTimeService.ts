import { getManager } from 'typeorm';
import WebSocket from 'ws';

class ManageActivationTimeService {
    status:string

    constructor(){
        this.status=""
    }
	public async execute(ws: WebSocket): Promise<void> {
        // console.log(now_hour, now_minute)
        const entityManager = getManager();

        const activationData = await entityManager.query(`
            select count(1)
            from public.activation_time
            where
                (case when ((hour_time_off * 60 + minute_time_off) >= (hour_time_on * 60 + minute_time_on))
                then (case when (extract(hour from now()) * 60 + extract(minute from now())) between (hour_time_on * 60 + minute_time_on) and (hour_time_off * 60 + minute_time_off - 1) then true else false end)
                else (case when ((extract(hour from now()) * 60 + extract(minute from now())) between (hour_time_on * 60 + minute_time_on) and (hour_time_off * 60 + minute_time_off - 1 + 24*60))
                or (((extract(hour from now()) * 60 + extract(minute from now())) + 24*60) between (hour_time_on * 60 + minute_time_on) and (hour_time_off * 60 + minute_time_off - 1 + 24*60)) then true else false end)
                end);
            `);
        let pumpStatus = Number(activationData[0]["count"])

        if(!pumpStatus){
            const obj_retorno={
                "type": "pump",
                "cmd": "off"
            }
            if(this.status!="off"){
                this.status="off"
                ws.send(JSON.stringify(obj_retorno))
                console.log(obj_retorno)
            }
        }else{
            const obj_retorno={
                "type": "pump",
                "cmd": "on"
            }
            if(this.status!="on"){
                this.status="on"
                ws.send(JSON.stringify(obj_retorno))
                console.log(obj_retorno)
            }
        }
        return
	}
}

export default ManageActivationTimeService;