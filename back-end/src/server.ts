import 'reflect-metadata'
import 'express-async-errors'
import express, {Request, Response, NextFunction} from 'express';
import expressWs from 'express-ws';
import routes from'./routes';
import cors from 'cors';
import './infra/typeorm';
import AppError from 'errors/AppError';
import SaveSensorDataService from 'services/SaveSensorDataService';

const app = expressWs(express()).app
app.use(cors());
app.use(express.json());

app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
	if (err instanceof AppError) {
		return response.status(err.statusCode).json({
			status: 'error',
			message: err.message,
		});
	}

	console.error(err);

	return response.status(500).json({
		status: 'error',
		message: 'Internal server error',
	});
});

app.ws('/', (ws, req)=>{
    ws.on('message', msg => {
      const data = JSON.parse(msg.toString())
      console.log(data)
      const saveSensorData = new SaveSensorDataService()
      saveSensorData.execute(data)
    })

  ws.on('close', () => {
      console.log('WebSocket was closed')
  })
})

app.listen(3333, ()=>{
  console.log('ta on')
});