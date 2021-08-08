import { Request, Response } from 'express';
import CalibrateConductivityService from 'services/CalibrateConductivityService';
import CalibratePhService from 'services/CalibratePhService';

export default class CalibrationController {
	public async low_ph(
		request: Request,
		response: Response,
	): Promise<Response> {
		const { estufa_id, ph } = request.body;

		const saveActivationTime = CalibratePhService.getInstance();

		await saveActivationTime.calibrateLowPh(estufa_id, ph);

		return response.json();
	}

    public async high_ph(
		request: Request,
		response: Response,
	): Promise<Response> {
		const { estufa_id, ph } = request.body;

		const saveActivationTime = CalibratePhService.getInstance();

		await saveActivationTime.calibrateHighPh(estufa_id, ph);

		return response.json();
	}

    public async conductivity(
		request: Request,
		response: Response,
	): Promise<Response> {
		const { estufa_id, conductivity } = request.body;

		const saveActivationTime = CalibrateConductivityService.getInstance();

		await saveActivationTime.calibrate(estufa_id, conductivity);

		return response.json();
	}
}