import express, { Application } from 'express';
import cors from 'cors';
import 'reflect-metadata';
import Database from '../db/init.mongo';
import RedisInitializer from '../db/init.redis';
import accessRouter from '../routes/access.router';
import userRouter from '../routes/user.router';
import { handleErrorsMiddeleware } from '../middlewares/errorhandler.middleware';
import { NotFoundRequestError } from '../core/error.response';
import { Request, Response, NextFunction } from 'express';

class App {
	public app: Application;

	constructor() {
		this.app = express();
		this.databaseConnect();
		this.redisConnect();
		this.plugins();
		this.routes();
		this.handleErrors();
	}

	private databaseConnect(): void {
		Database.getInstance();
	}

	private redisConnect(): void {
		RedisInitializer.getInstance();
	}

	private routes(): void {
		this.app.use('/v1/api/', accessRouter);
		this.app.use('/v1/api/users', userRouter);
	}

	private plugins(): void {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(cors());
	}

	private handleErrors(): void {
		this.app.use("*", (req: Request, res: Response, next: NextFunction) => {
			next(new NotFoundRequestError());
		});
		this.app.use(handleErrorsMiddeleware);
	}
}

export default new App().app;