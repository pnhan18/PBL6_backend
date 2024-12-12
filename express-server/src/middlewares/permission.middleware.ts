import { Request, Response, NextFunction } from "express";
import rbac from "./role.middleware";
import { AuthFailureError } from "../core/error.response";

type Action = 'createAny' | 'readAny' | 'updateAny' | 'deleteAny' | 'createOwn' | 'readOwn' | 'updateOwn' | 'deleteOwn';

export const grantAccess = (action: Action, resource: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const role = req.user?.role as string;
            const permission = rbac.can(role)[action](resource);
            if (!permission.granted) {
                throw new AuthFailureError('Permission denied');
            }
            if (action.includes('Own')) {
                const resourceOwnerId = req.params.userId;
                const currentUserId = req.user?._id;

                if (resourceOwnerId !== currentUserId) {
                    throw new AuthFailureError('Permission denied');
                }
            }
            return next();
        } catch (error) {
            next(error);
        }
    };
}