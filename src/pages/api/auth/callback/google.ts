import middlewares, { errorMiddleware, onNoMatch, passport } from '@/middlewares';
import { NextApiRequestExt } from '@/types/types';
import { NextApiResponse } from "next";
import nextConnect from "next-connect";

const handlerOptions = { onNoMatch, onError: errorMiddleware };
const handler = nextConnect<NextApiRequestExt, NextApiResponse>(handlerOptions);

const url = process.env.BASE_URL || 'http://localhost:3000';

console.log(url)
handler
    .use(middlewares)
    .get(passport.authenticate('auth-google', {
        failureRedirect: `${url}/auth-failed`,
        successRedirect: url
    }))

export default handler;
