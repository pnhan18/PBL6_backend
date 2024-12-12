import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { validateSchema } from "./schema.validate";

const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const signUpSchema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required(),
        gender: Joi.string().valid("male", "female").required(),
        dateOfBirth: Joi.date().required()
    });

    await validateSchema(signUpSchema, req.body, next);
};

const updateInformationUser = async (req: Request, res: Response, next: NextFunction) => {
    const updateInformationUserSchema = Joi.object({
        username: Joi.string().optional(),
        password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).optional(),
        dateOfBirth: Joi.date().optional()
    });

    await validateSchema(updateInformationUserSchema, req.body, next);
};

export { signUp, updateInformationUser };
