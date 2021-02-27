import middlewares, { ErrorHandler, errorMiddleware, onNoMatch } from '@/middlewares';
import { Pet } from '@/models';
import { NextApiRequestExt } from '@/types/types';
import { NextApiResponse } from "next";
import nextConnect from "next-connect";

const handlerOptions = { onNoMatch, onError: errorMiddleware };
const handler = nextConnect<NextApiRequestExt, NextApiResponse>(handlerOptions);

handler
    .use(middlewares)
    .get(async (req, res, next) => {
        try {
            const species = await Pet.distinct('species');
            const countries = await Pet.distinct('country');

            res.status(200).json({ data: { species, countries } });
        } catch (err) {
            next(new ErrorHandler(500));
        }
    });

export default handler;
