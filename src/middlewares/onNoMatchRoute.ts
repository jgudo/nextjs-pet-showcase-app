import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { ErrorHandler } from "./errorMiddleware";

export default (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    next(new ErrorHandler(400, 'Unable to process your request.'));
}