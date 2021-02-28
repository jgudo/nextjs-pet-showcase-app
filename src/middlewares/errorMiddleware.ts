import { NextApiRequest, NextApiResponse } from "next";

class ErrorHandler extends Error {
    statusCode: number
    message: string | undefined;
    constructor(statusCode: number, message?: string) {
        super()
        this.statusCode = statusCode;
        this.message = message;
    }
}

const errorResponseJSON = (
    statusCode: number,
    message: string,
    status: string = 'error',
    errors: any[] = []
) => ({
    status,
    statusCode,
    message,
    errors
})

const errorMiddleware = (err: any, req: NextApiRequest, res: NextApiResponse) => {
    const { statusCode = 500, message = 'Internal Server Error' } = err;

    if (err.name === 'ValidationError') { // For mongoose validation error handler
        const errors = Object.values(err.errors).map((el: any) => ({ message: el.message, path: el.path }));

        console.log('FROM MIDDLEWARE MONGOOSE ------------------------', err)
        return res.status(400).json(errorResponseJSON(400, 'Validation Error', 'validation-error', errors));
    }
    if (err.statusCode === 400) { // BadRequestError
        return res.status(400).json(errorResponseJSON(400, err?.message || "Bad request."));
    }
    if (err.statusCode === 401) { // UnathorizeError
        return res.status(401).json(errorResponseJSON(401, err?.message || "You're not authorized to perform your request."));
    }
    if (err.statusCode === 403) { // Forbidden
        return res.status(403).json(errorResponseJSON(403, err?.message || 'Forbidden'));
    }
    if (err.statusCode === 404) { // NotFoundError
        return res.status(404).json(errorResponseJSON(404, err?.message || 'Requested resource not found.'));
    }
    if (err.statusCode === 422) { // UnprocessableEntity
        return res.status(422).json(errorResponseJSON(422, err?.message || 'Unable to process your request.'));
    }

    console.log('FROM MIDDLEWARE ------------------------', err)
    res.status(statusCode).json(errorResponseJSON(statusCode, message));
}

export { errorMiddleware as default, ErrorHandler };

