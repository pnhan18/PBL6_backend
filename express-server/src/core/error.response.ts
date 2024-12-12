'use strict';
import { ReasonPhrases, StatusCodes } from '../utils/httpStatusCode';

class ErrorResponse extends Error {
    public statusCode: number;
    constructor(message: string, status: number) {
        super(message);
        this.statusCode = status;
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.BAD_REQUEST, statusCodes = StatusCodes.BAD_REQUEST) {
        super(message, statusCodes);
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.CONFLICT, statusCodes = StatusCodes.CONFLICT) {
        super(message, statusCodes);
    }
}

class NotFoundRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_FOUND, statusCodes = StatusCodes.NOT_FOUND) {
        super(message, statusCodes);
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, statusCodes = StatusCodes.UNAUTHORIZED) {
        super(message, statusCodes);
    }
}

class ForbiddenRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.FORBIDDEN, statusCodes = StatusCodes.FORBIDDEN) {
        super(message, statusCodes);
    }
}

class RedisError extends ErrorResponse {
    constructor(message = ReasonPhrases.INTERNAL_SERVER_ERROR, statusCodes = StatusCodes.INTERNAL_SERVER_ERROR) {
        super(message, statusCodes);
    }
}

class UnProcessableEntityError extends ErrorResponse {
    constructor(error: string = ReasonPhrases.UNPROCESSABLE_ENTITY, statusCodes = StatusCodes.UNPROCESSABLE_ENTITY) {
        super(error, statusCodes);
    }
    
}

export {
    ErrorResponse,
    BadRequestError,
    ConflictRequestError,
    NotFoundRequestError,
    AuthFailureError,
    ForbiddenRequestError,
    RedisError,
    UnProcessableEntityError
}