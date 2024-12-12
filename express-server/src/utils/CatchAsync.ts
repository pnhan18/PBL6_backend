import { NextFunction, Request, Response } from 'express';

const CatchAsync = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    }
}

export default CatchAsync;