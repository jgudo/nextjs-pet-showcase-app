import middlewares, { errorMiddleware, onNoMatch, passport } from '@/middlewares';
import { NextApiRequestExt } from '@/types/types';
import { NextApiResponse } from "next";
import nextConnect from "next-connect";

const handlerOptions = { onNoMatch, onError: errorMiddleware };
const handler = nextConnect<NextApiRequestExt, NextApiResponse>(handlerOptions);

export const config = {
    api: {
        externalResolver: true,
    },
}

handler
    .use(middlewares)
    .get(passport.authenticate('auth-facebook', { scope: ['email', 'public_profile'] }))

export default handler;
