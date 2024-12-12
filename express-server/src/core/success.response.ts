import { Response } from "express";

import { ReasonPhrases, StatusCodes } from "../utils/httpStatusCode";

class SuccessResponse {
    public message: string;
    public metadata: any;
    public status: number;
    constructor(message: string, metadata = {}, statusCode = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK) {
        this.message = message ? message : reasonStatusCode;
        this.metadata = metadata;
        this.status = statusCode;
    }

    send(res: Response, header = {}) {
        return res.status(this.status).json(this);
    }
}

class OK extends SuccessResponse {
    constructor(message: string, metadata = {}) {
        super(message, metadata);
    }
}

class CREATED extends SuccessResponse {
    constructor(message: string, metadata = {}, statusCode = StatusCodes.CREATED, reasonStatusCode = ReasonPhrases.CREATED) {
        super(message, metadata, statusCode, reasonStatusCode);
    }
}

export {
    OK,
    CREATED
}