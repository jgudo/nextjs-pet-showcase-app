import { NextApiRequest, NextApiResponse } from "next";

class ErrorHandler extends Error {
    statusCode: number
    message: string
    constructor(statusCode: number, message?: string) {
        super()
        this.statusCode = statusCode;
        this.message = message;
    }
}

const errorResponseJSON = (statusCode: number, message: string) => ({
    status: 'error',
    statusCode,
    message
})

const errorMiddleware = (err: any, req: NextApiRequest, res: NextApiResponse) => {
    const { statusCode = 500, message = 'Internal Server Error' } = err

    if (err.statusCode === 401) {
        return res.status(401).json(errorResponseJSON(401, err.message));
    }
    if (err.statusCode === 403) {
        return res.status(403).json(errorResponseJSON(403, err.message));
    }
    if (err.statusCode === 404) {
        return res.status(404).json(errorResponseJSON(404, err.message));
    }
    if (err.statusCode === 422) {
        return res.status(422).json(errorResponseJSON(422, err.message));
    }

    res.status(statusCode).json(errorResponseJSON(statusCode, message));
}

export { errorMiddleware as default, ErrorHandler };

