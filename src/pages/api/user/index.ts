import middlewares, { errorMiddleware, onNoMatch } from '@/middlewares/index';
import { NextApiRequestExt } from '@/types/types';
import { NextApiResponse } from 'next';
import nextConnect from "next-connect";

const handlerOptions = { onNoMatch, onError: errorMiddleware }
const handler = nextConnect<NextApiRequestExt, NextApiResponse>(handlerOptions);

handler
    .use(middlewares)
    .get((req, res) => {
        if (!req.user) return res.json({ success: false, data: null });

        return res.json({ user: req.user.toJSON() });
    })

export default handler;
