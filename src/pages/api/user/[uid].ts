import middlewares, { errorMiddleware, onNoMatch } from '@/middlewares/index';
import { User } from '@/models';
import { NextApiRequestExt } from '@/types/types';
import { NextApiResponse } from 'next';
import nextConnect from "next-connect";

const handlerOptions = { onNoMatch, onError: errorMiddleware }
const handler = nextConnect<NextApiRequestExt, NextApiResponse>(handlerOptions);

handler
    .use(middlewares)
    .get(async (req, res) => {
        const user = await User.findById(req.query.uid);

        return res.json({ success: true, data: user.toJSON() });
    })

export default handler;
