import express, { Application } from 'express';
import cors from 'cors';
import 'reflect-metadata';
import Database from '../db/init.mongo';
import RedisInitializer from '../db/init.redis';
import accessRouter from '../routes/access.router';
import userRouter from '../routes/user.router';
import recognitonRouter from '../routes/recognition.router';
import recognitionHistoryRouter from '../routes/recognitionHistory.router';
import signLanguageRouter from '../routes/signLanguage.router';
import { handleErrorsMiddeleware } from '../middlewares/errorhandler.middleware';
import { NotFoundRequestError } from '../core/error.response';
import { Request, Response, NextFunction } from 'express';
import passport from "../config/passport.config";
import morgan from 'morgan';

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
		this.app.use("/v1/api/recognition", recognitonRouter);
		this.app.use("/v1/api/recognition-history", recognitionHistoryRouter);
		this.app.use("/v1/api/sign-language", signLanguageRouter);
	}

	private plugins(): void {
		this.app.use(cors({
			origin: '*',
			methods: ['GET','POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
			credentials: true
		}));
		this.app.use(passport.initialize());
		this.app.use(morgan('dev'));
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
	}

	private handleErrors(): void {
		this.app.use("*", (req: Request, res: Response, next: NextFunction) => {
			next(new NotFoundRequestError());
		});
		this.app.use(handleErrorsMiddeleware);
	}
}

export default new App().app;