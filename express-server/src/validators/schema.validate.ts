import Joi from "joi";
import { UnProcessableEntityError } from "../core/error.response";
import { NextFunction } from "express";

const validateSchema = async (schema: Joi.ObjectSchema, data: any, next: NextFunction) => {
    try {
        await schema.validateAsync(data, { abortEarly: false });
        return next();
    } catch (error: any) {
        const errorMessages = error.details.map((err: Joi.ValidationErrorItem) => err.message);
        next(new UnProcessableEntityError(errorMessages));
    }
};

export { validateSchema };