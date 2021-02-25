import middlewares, { ErrorHandler, errorMiddleware, onNoMatch } from '@/middlewares/index';
import { Pet } from '@/models';
import { NextApiRequestExt } from '@/types/types';
import { NextApiResponse } from 'next';
import nextConnect from "next-connect";

const handlerOptions = { onNoMatch, onError: errorMiddleware }
const handler = nextConnect<NextApiRequestExt, NextApiResponse>(handlerOptions);

handler
    .use(middlewares)
    .get(async (req, res, next) => {
        const { q } = req.query;

        if (!q) return;

        try {
            const query = await Pet
                .find({
                    $or: [
                        { name: { $regex: q as string, $options: 'i' } }
                    ]
                });

            return res.json({ success: true, data: query });
        } catch (err) {
            next(new ErrorHandler(500));
        }
    })

export default handler;
