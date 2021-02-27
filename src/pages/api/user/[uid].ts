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
        const { uid } = req.query;

        if ((uid === 'me' && req.user) || uid === req.user._id.toString()) {
            const me = { user: { ...req.user.toJSON(), isOwnProfile: true } };

            return res.status(200).json(me);
        }

        const user = await User.findById(req.query.uid);

        return res.status(200).json({ user: { ...user.toJSON(), isOwnProfile: false } });
    })

export default handler;
