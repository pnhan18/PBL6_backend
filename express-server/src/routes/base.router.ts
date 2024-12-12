import { Router } from 'express';
import IRouter from './interfaces/router.interface';

abstract class BaseRouter implements IRouter {
	public router: Router;
	public controller: any;

	constructor(controller: any) {
		this.router = Router();
		this.controller = controller;
		this.routes();
	}

	abstract routes(): void;
}

export default BaseRouter;